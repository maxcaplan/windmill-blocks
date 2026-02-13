import { cloneDeep, isEmpty } from 'lodash';

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
 * @param {Record<string, any>} object The object `deepFilter` was called upon
 * @returns {Boolean}
 */

/**
 * Return a property of a value if it is an object, and the value otherwise
 *
 * @example
 * keyOrValue({ foo: "bar" }, "foo") // returns: "bar"
 * keyOrValue("foobar", "foo") // returns: "foobar"
 *
 * @template {Record<string, any>} T
 * @template {keyof T} K
 *
 * @param {T|any} [value]
 * @param {K} [key]
 * @returns {(T[K]|any)}
 */
export function propertyOrValue(value, key) {
	if (
		!!value &&
		key !== undefined &&
		!Array.isArray(value) &&
		typeof value === 'object'
	) {
		return value[key];
	}

	return value;
}

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
	return deepFilterInternal(object, predicate);
}

/**
 * @template {Record<string, any>} T
 *
 * @param {T} base_object
 * @param {DeepFilterCallback} predicate
 * @param {any} [object]
 * @returns {DeepPartial<T>}
 */
function deepFilterInternal(base_object, predicate, object) {
	object = object === undefined ? cloneDeep(base_object) : object;

	// Iterate over current objects properties
	Object.entries(object).forEach(([key, value]) => {
		// If property of current object is an object with properties, traverse said object
		if (
			!!value &&
			!Array.isArray(value) &&
			typeof value === 'object' &&
			!isEmpty(value)
		) {
			deepFilterInternal(base_object, predicate, value);

			// Remove empty object properties
			if (isEmpty(value)) {
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

/**
 * @callback HasPropertyCallback
 * @param {[string, any]} property Current property of the object
 * @param {object} object the Object `hasProperties` was called upon
 * @returns {boolean}
 */

/**
 * Test if a given value has all properties for a given list of property keys.
 * A predicate callback can optionally be given to test the value of each property in the given value.
 *
 * @param {object} value Value to test
 * @param {string[]} property_keys Keys of properties to test `value` for
 * @param {HasPropertyCallback} [predicate] Callback test called for each property of value for `property_keys`
 */
export function hasProperties(value, property_keys, predicate) {
	return !property_keys.some((key) => {
		if (!Object.hasOwn(value, key)) {
			return true;
		}

		if (predicate !== undefined && !predicate([key, value[key]], value)) {
			return true;
		}

		return false;
	});
}
