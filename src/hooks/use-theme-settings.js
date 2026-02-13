import { hasProperties } from '@/util/objects';
import { useSettings } from '@wordpress/block-editor';

/**
 * Typedefs
 */

/**
 * @typedef SettingTypeMap
 * @property {string} string
 * @property {number} number
 * @property {object} object
 */

/**
 * @typedef {keyof SettingTypeMap} SettingLiteralType
 */

/**
 * @template {Record<string, SettingLiteralType>} T
 * @typedef {{[K in keyof T]: SettingTypeMap[T[K]]}} ThemeSettingObject
 */

/**
 * @callback SettingTypePredicate
 * @param {any} value
 * @returns {boolean}
 */

/**
 * Public Functions
 */

/**
 * Get theme settings object array
 *
 * @template {Record<string, SettingLiteralType>} T
 *
 * @param {string} path Settings path
 * @param {T} type Setting type object
 * @param {SettingTypePredicate} [predicate]
 * @returns {ThemeSettingObject<T>[]}
 */
export function useThemeSettingsObjects(path, type, predicate) {
	const type_keys = Object.keys(type);

	/**
	 * Check that value matches shape of given type shape
	 * @returns {value is {[K in keyof T]: any}}
	 */
	const isType = (value) => {
		if (typeof value !== 'object') {
			return false;
		}

		return hasProperties(value, type_keys, ([key, value]) => {
			if (predicate !== undefined) {
				return predicate(value);
			} else {
				return typeof value === type[key];
			}
		});
	};

	return useThemeSettingsInternal(path, isType);
}

/**
 * Get theme settings array
 *
 * @template {SettingLiteralType} T
 *
 * @param {string} path Settings path
 * @param {T} type Setting type
 * @param {(value: any) => boolean} [predicate] Test function called for each setting
 * @returns {SettingTypeMap[T][]}
 */
export function useThemeSettings(path, type, predicate) {
	const isType = (value) => {
		if (predicate !== undefined) {
			return predicate(value);
		}

		return typeof value === type;
	};

	return useThemeSettingsInternal(path, isType);
}

/**
 * Private Functions
 */

/**
 * @param {string} path
 * @param {(value: any) => boolean} typeCallback
 * @returns {any[]}
 */
function useThemeSettingsInternal(path, typeCallback) {
	const [theme_settings] = useSettings(path);

	if (typeCallback(theme_settings)) {
		return [theme_settings];
	}

	if (Array.isArray(theme_settings)) {
		return theme_settings.reduce((acc, setting) => {
			if (typeCallback(setting)) {
				acc.push(setting);
			}

			return acc;
		}, []);
	}

	return [];
}
