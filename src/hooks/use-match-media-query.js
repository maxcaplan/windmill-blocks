import { useEffect, useState } from 'react';

/**
 * Responsive state of a media queries match
 *
 * @param {string} query
 * @param {boolean} with_window
 * @returns {boolean}
 */
export default function useMatchMediaQuery(query, with_window = true) {
	const [matchesQuery, setMatchesQuery] = useState(false);
	const [media, setMedia] = useState(
		/** @type {MediaQueryList|undefined} */ (undefined)
	);

	/** @param {MediaQueryListEvent} event */
	const onMediaChange = (event) => {
		setMatchesQuery(event.matches);
	};

	useEffect(() => {
		if (media !== undefined) {
			media.removeEventListener('change', onMediaChange);
		}

		const new_media = with_window
			? window.matchMedia(query)
			: matchMedia(query);

		setMedia(new_media);
		setMatchesQuery(new_media.matches);

		new_media.addEventListener('change', onMediaChange);
	}, [query]);

	return matchesQuery;
}
