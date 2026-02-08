import { merge } from 'lodash';
import objectScan from 'object-scan';

/**
 * Make all properties in `T` deeply nullable and optional
 * @template T
 * @typedef {{[K in keyof T]?: DeepNullablePartial<T[K]> | null}} DeepNullablePartial
 */

/**
 * Create a setter function for a block attribute that is of type `Object`
 *
 * Properties can be updated or added to the attribute.
 * @example
 * // props.attributes["key"] = { a: 1, b: 2, c: { d: 3 } }
 * useSetObjectAttribute(props, "key")({ a: 0, c: { e: 4 } })
 * // props.attributes["key"] = { a: 0, b: 2, c: { d: 3, e: 4 } }
 *
 * Properties can be removed from the attribute by 'nulling' them.
 * @example
 * // props.attributes["key"] = { a: 1, b: 2, c: { d: 3, e: 4 } }
 * useSetObjectAttribute(props, "key")({ a: null, c: { e: null } })
 * // props.attributes["key"] = { b: 2, c: { d: 3 } }
 *
 * @template {Record<String, any>} T
 * @template {keyof T} K
 *
 * @param {import('@wordpress/blocks').BlockEditProps<T>} props Block edit props
 * @param {K} attribute_key Key of attribute to set
 * @returns {(value: DeepNullablePartial<T[K]>) => void} Attribute setter
 *
 * @throws Will throw an error if `attribute_key` has an asociated value that is not an `Object` or `undefined`
 */
export function useSetObjectAttribute(props, attribute_key) {
	const { attributes, setAttributes } = props;

	// Ensure attribute value is an object if defined
	if (
		typeof attributes[attribute_key] !== 'undefined' &&
		typeof attributes[attribute_key] !== 'object'
	) {
		throw new Error(
			'Attribute not of type `object` cannot be set to a value of type `object`'
		);
	}

	/** Remove all null properties and subproperties in an object */
	const deepRemoveNull = (obj) => {
		Object.entries(obj).forEach(([key, value]) => {
			if (value && typeof value === 'object') {
				deepRemoveNull(value);
			}

			if (
				(value &&
					typeof value === 'object' &&
					!Object.keys(value).length) ||
				value === null ||
				value === undefined
			) {
				delete obj[key];
			}
		});
		return obj;
	};

	/**
	 * Object attribute setter
	 *
	 * @param {DeepNullablePartial<T[K]>} value
	 */
	const setObjectAttribute = (value) => {
		// Create clone of attribute value
		const new_attributes = structuredClone(attributes) || {};

		// Merge cloned attributes with update values
		merge(new_attributes, { [attribute_key]: value });

		// Delete any properties set to null
		deepRemoveNull(new_attributes);

		// Set new attribute value
		setAttributes(new_attributes);
	};

	return setObjectAttribute;
}
