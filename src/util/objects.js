/**
 * Construct a type with all properties and subproperties of `Type` set to optional.
 * @template Type
 * @typedef {Type extends object ? {[K in keyof Type]?: DeepPartial<Type[K]>} : Type} DeepPartial
 */

/**
 * @callback DeepFilterCallback A function to execute for each property of an object
 * @param {object} property Current property being processed in the object
 * @param {string} property.key
 * @param {any} property.value
 * @param {Record<string, any>} object The object `deepFilter()` was called upon
 * @returns {Boolean}
 */

/**
 * Return a deep copy of an objects properties that meet the condition specified in a callback function.
 *
 * @template {Record<string, any>} T
 *
 * @param {T} object
 * @param {DeepFilterCallback} predicate
 * @returns {DeepPartial<T>}
 */
export function deepFilter(object, predicate) {
	return deepFilterInternal(object, structuredClone(object), predicate);
}

/**
 * @template {Record<string, any>} T
 *
 * @param {T} base_object
 * @param {any} object
 * @param {DeepFilterCallback} predicate
 * @returns {DeepPartial<T>}
 */
function deepFilterInternal(base_object, object, predicate) {
	// Iterate over current objects properties
	Object.entries(object).forEach(([key, value]) => {
		// If property of current object is an object with properties, traverse said object
		if (
			!!value &&
			!Array.isArray(value) &&
			typeof value === 'object' &&
			Object.entries(value).length > 0
		) {
			deepFilterInternal(base_object, value, predicate);

			// Remove empty object properties
			if (Object.entries(value).length === 0) {
				delete object[key];
			}
		}

		// Remove property from object if it does not meet predicate condition
		if (!predicate({ key, value }, base_object)) {
			delete object[key];
		}
	});

	return object;
}
