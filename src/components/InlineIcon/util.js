import * as TypeDefs from '../../blocks/icon/typedefs';

import { hasProperties } from '@/util/objects';

/**
 * Check if a value is of type `IconData`
 *
 * @param {any} value
 * @returns {value is TypeDefs.IconData}
 */
export function isIconData(value) {
	if (value === undefined || value === null || typeof value !== 'object') {
		return false;
	}

	return hasProperties(
		value,
		['filename', 'basename', 'url'],
		([_, value]) => typeof value === 'string'
	);
}

/**
 * Check if a value is of type `IconData[]`
 *
 * @param {any} value
 * @returns {value is TypeDefs.IconData[]}
 */
export function isIconDataArray(value) {
	if (value === undefined || value === null || !Array.isArray(value)) {
		return false;
	}

	for (let i = 0; i < value.length; i++) {
		if (!isIconData(value[i])) {
			return false;
		}
	}

	return true;
}
