import * as TypeDefs from './typedefs';

import { isString } from 'lodash';

export const DEFAULT_PRESET_VALUE = 'default';

/**
 * Presets
 */

/** Named CSS timing functions */
export const timing_values = [
	'ease',
	'linear',
	'ease-in',
	'ease-out',
	'ease-in-out',
];

/**
 * Timing function select control options
 * @type {TypeDefs.PresetSelectControlOptions}
 */
export const timing_options = timing_values.map((value) => ({
	label: value,
	value,
}));

/** CSS duration values */
export const duration_values = [150, 300, 500, 1000];

/**
 * Duration select control options
 * @type {TypeDefs.PresetSelectControlOptions}
 */
export const duration_options = [
	...duration_values.map((value) => ({
		label:
			value < 1000
				? `${value} millisecond${value > 1 ? 's' : ''}`
				: `${value / 1000} second${value > 1000 ? 's' : ''}`,
		value: value.toString(),
	})),
	{ label: 'None', value: '0' },
];

/**
 * Utility functions
 */

/**
 * Returns the first preset value that matches a given value, and undefined otherwise.
 *
 * @param {any} [value] Value to search for
 * @param {TypeDefs.PresetSelectControlOptionValues} [preset_options] Preset options to search
 * @returns {(TypeDefs.PresetOptionValue|undefined)}
 */
export const findPreset = (value, preset_options) => {
	value = isString(value) ? value.trim() : value;
	return preset_options?.find((option) => option.value === value)?.value;
};

/**
 * Check whether a value is in a list of preset option values
 *
 * @param {any} [value] Value to check
 * @param {TypeDefs.PresetSelectControlOptionValues} [preset_options] Preset options to check against
 * @returns {Boolean}
 */
export const isPresetValue = (value, preset_options) => {
	return findPreset(value, preset_options) !== undefined;
};

/**
 * Returns the first preset value that matches a value, and the default value otherwise.
 *
 * @param {String} [value] Value to get a preset value for
 * @param {TypeDefs.PresetSelectControlOptionValues} [preset_options] Preset options to check against
 * @returns {TypeDefs.PresetOptionValue}
 */
export const presetValue = (value, preset_options) => {
	return findPreset(value, preset_options) || DEFAULT_PRESET_VALUE;
};
