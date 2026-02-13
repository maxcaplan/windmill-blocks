import { expect, test } from '@jest/globals';
import {
	findOption,
	isOptionValue,
	optionValue,
	DEFAULT_PRESET_VALUE,
} from '../options';

const preset_options = [
	{ label: 'A', value: 'a' },
	{ label: 'B', value: 'b' },
	{ label: 'C', value: 'c' },
	{ label: '#1', value: '1' },
	{ label: '#2', value: '2' },
	{ label: '#3', value: '3' },
	{ label: 'TRUE', value: 'true' },
];

/**
 * findPreset
 */

test('Finds correct preset value', () => {
	expect(findOption('a', preset_options)).toBe('a');
	expect(findOption('1', preset_options)).toBe('1');
	expect(findOption(3, preset_options)).toBe('3');
	expect(findOption(true, preset_options)).toBe('true');

	expect(findOption(false, preset_options)).toBe(undefined);
	expect(findOption(12, preset_options)).toBe(undefined);
	expect(findOption('z', preset_options)).toBe(undefined);
	expect(findOption(undefined, preset_options)).toBe(undefined);
	expect(findOption({}, preset_options)).toBe(undefined);
});

/**
 * presetValue
 */

test('Gets correct preset value', () => {
	expect(optionValue('a', preset_options)).toBe('a');
	expect(optionValue(1, preset_options)).toBe('1');
	expect(optionValue(true, preset_options)).toBe('true');

	expect(optionValue('z', preset_options)).toBe(DEFAULT_PRESET_VALUE);
	expect(optionValue(12, preset_options)).toBe(DEFAULT_PRESET_VALUE);
	expect(optionValue(false, preset_options)).toBe(DEFAULT_PRESET_VALUE);
	expect(optionValue(undefined, preset_options)).toBe(DEFAULT_PRESET_VALUE);
	expect(optionValue({}, preset_options)).toBe(DEFAULT_PRESET_VALUE);
});

/**
 * isPresetValue
 */

test('Preset value is a preset value', () => {
	expect(isOptionValue('a', preset_options)).toBe(true);
	expect(isOptionValue('b', preset_options)).toBe(true);
	expect(isOptionValue('c', preset_options)).toBe(true);
	expect(isOptionValue('1', preset_options)).toBe(true);
	expect(isOptionValue('2', preset_options)).toBe(true);
	expect(isOptionValue('3', preset_options)).toBe(true);

	expect(isOptionValue(' a', preset_options)).toBe(true);
	expect(isOptionValue('b ', preset_options)).toBe(true);
	expect(isOptionValue('   c    ', preset_options)).toBe(true);
	expect(isOptionValue(1, preset_options)).toBe(true);
	expect(isOptionValue(2, preset_options)).toBe(true);
	expect(isOptionValue(true, preset_options)).toBe(true);
});

test('Non preset value is not a preset value', () => {
	expect(isOptionValue('d', preset_options)).toBe(false);
	expect(isOptionValue('e', preset_options)).toBe(false);
	expect(isOptionValue('4', preset_options)).toBe(false);
	expect(isOptionValue('5', preset_options)).toBe(false);

	expect(isOptionValue(12, preset_options)).toBe(false);
	expect(isOptionValue(false, preset_options)).toBe(false);
});

test('undefined is a preset value', () => {
	expect(isOptionValue(undefined, preset_options)).toBe(true);
});
