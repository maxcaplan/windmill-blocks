import React, { useEffect, useRef, useState } from 'react';

/**
 * Responsive state of a media queries match
 *
 * @template {HTMLElement} T
 *
 * @returns {[React.RefObject<T|null>, number, number]} Ref object, width, height
 */
export default function useRefDimensions() {
	const ref = useRef(/** @type {T|null} */ (null));

	const [refWidth, setRefWidth] = useState(0);
	const [refHeight, setRefHeight] = useState(0);

	/** @param {UIEvent} event */
	const onRefResize = (event) => {
		if (ref.current === null) {
			return;
		}

		setRefWidth(ref.current.clientWidth);
		setRefHeight(ref.current.clientHeight);
	};

	useEffect(() => {
		if (ref.current !== null) {
			ref.current.addEventListener('resize', onRefResize);
		}

		return () => {
			if (ref.current !== null) {
				ref.current.removeEventListener('resize', onRefResize);
			}
		};
	}, []);

	return [ref, refWidth, refHeight];
}
