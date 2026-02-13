export const DEFAULT_PRESET_VALUE = 'default';

/**
 * @typedef PresetOption
 * @property {string} value
 */

/**
 * Returns the first preset value that matches a given value, and undefined otherwise.
 *
 * @param {any} [value] Value to search for
 * @param {PresetOption[]} [preset_options] Preset options to search
 * @returns {(PresetOption["value"]|undefined)}
 */
export const findOption = (value, preset_options) => {
	if (typeof value === 'number' || typeof value === 'boolean') {
		value = value.toString();
	}
	if (value === undefined || typeof value !== 'string') {
		return undefined;
	}

	value = value.trim();

	return preset_options?.find((option) => option.value === value)?.value;
};

/**
 * Returns whether a given value is in a given preset options array.
 * Undefined values are considered to be the default preset and return true.
 *
 * @param {any} [value] Value to check
 * @param {PresetOption[]} [preset_options] Preset options to check against
 * @returns {Boolean}
 */
export const isOptionValue = (value, preset_options) => {
	if (value === undefined) {
		return true;
	}
	return findOption(value, preset_options) !== undefined;
};

/**
 * Returns the first preset value that matches a value, and the default value otherwise.
 *
 * @param {any} [value] Value to get a preset value for
 * @param {PresetOption[]} [preset_options] Preset options to check against
 * @returns {PresetOption["value"]}
 */
export const optionValue = (value, preset_options) => {
	return findOption(value, preset_options) || DEFAULT_PRESET_VALUE;
};
