import * as TypeDefs from './typedefs';

import { presetStyleValue } from '@/util/theme';

/**
 * @param {TypeDefs.WindmillBlocksIconAttributes} attributes
 *
 * @returns {{style?: React.CSSProperties }}
 */
export default function useIconBlockProps(attributes) {
	const { size } = attributes;

	/** @type {React.CSSProperties} */
	const style = {
		...createStyleProperty('width', size),
		...createStyleProperty('height', size),
	};

	return { style };
}

/**
 * @param {keyof React.CSSProperties} property
 * @param {string} [value]
 * @returns {{ [name: string]: string }|undefined}
 */
function createStyleProperty(property, value) {
	value = presetStyleValue(value);
	return value === undefined ? value : { [property]: value };
}
