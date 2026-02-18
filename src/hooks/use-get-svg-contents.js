import { useEffect, useState } from 'react';

import DOMPurify from 'dompurify';
import { parseErrorMessage } from '@/util/error';

/**
 * Get the contents of an svg from a given url as a string.
 *
 * @param {string} [src]
 * @returns {[string|undefined, () => Promise<void>, boolean, string|undefined]} Svg content state, re-fetch function, fetching status, fetch error message
 */
export default function useGetSvgContents(src) {
	const [fetchAbortController, setFetchAbortController] = useState(
		/** @type {AbortController|undefined} */ (undefined)
	);
	const [isFetchingSvg, setIsFetchingSvg] = useState(false);
	const [fetchErrorMessage, setFetchErrorMessage] = useState(
		/** @type {string|undefined} */ (undefined)
	);

	const [svgContent, setSvgContent] = useState(
		/** @type {string|undefined} */ (undefined)
	);

	/** @param {string} [icon_url] */
	const getSvgContent = async (icon_url) => {
		if (icon_url === undefined) {
			setSvgContent(undefined);
			setIsFetchingSvg(false);
			return;
		}

		const controller = new AbortController();
		setFetchAbortController(controller);

		try {
			setIsFetchingSvg(true);
			setFetchErrorMessage(undefined);

			// Fetch svg
			const result = await fetch(icon_url, { signal: controller.signal });

			// Ensure result is an svg file
			if (result.headers.get('Content-Type') !== 'image/svg+xml') {
				throw new Error('Invalid content type');
			}

			// Get svg content as string
			const content = await result.text();

			// Sanitize svg string
			const clean_content = DOMPurify.sanitize(content, {
				USE_PROFILES: { svg: true, svgFilters: true },
				ALLOWED_ATTR: ['viewBox'],
			});

			setSvgContent(clean_content);
		} catch (err) {
			if (!(err instanceof DOMException && err.name === 'AbortError')) {
				console.error('Error fetching svg:', err);
				setFetchErrorMessage(parseErrorMessage(err));
			}
		} finally {
			setIsFetchingSvg(false);
		}
	};

	/** Trigger fetch for icon */
	const reFetchSvg = async () => {
		fetchAbortController?.abort();
		getSvgContent(src);
	};

	// Fetch icon from url
	useEffect(() => {
		fetchAbortController?.abort();
		getSvgContent(src);
	}, [src]);

	return [svgContent, reFetchSvg, isFetchingSvg, fetchErrorMessage];
}
