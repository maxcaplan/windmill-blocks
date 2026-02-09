import * as TypeDefs from './typedefs';

import { useState } from 'react';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	SelectControl,
	TextControl,
	Button,
	Icon,
} from '@wordpress/components';
import { settings as customToggleIcon } from '@wordpress/icons';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { DEFAULT_PRESET_VALUE, isPresetValue, presetValue } from './presets';

/**
 * @param {Object} props Component props
 * @param {import('@wordpress/components').IconType} [props.icon]
 * @param {number} [props.iconSize]
 * @param {String} [props.label]
 * @param {String} [props.presetLabel]
 * @param {String} [props.customLabel]
 * @param {String} [props.placeholder]
 * @param {Boolean} [props.withRange]
 * @param {number} [props.rangeInitialPosition]
 * @param {number} [props.rangeMin]
 * @param {number} [props.rangeMax]
 * @param {(number|"any")} [props.step]
 * @param {TypeDefs.PresetSelectControlOptions} [props.presetOptions]
 * @param {(string|number)} [props.value]
 * @param {(value: string|null) => void} [props.onChange]
 * @returns {React.JSX.Element}
 */
export default function PresetSettingControl(props) {
	const {
		icon,
		iconSize,
		label,
		presetLabel,
		customLabel,
		placeholder,
		withRange,
		rangeInitialPosition,
		rangeMin,
		rangeMax,
		step,
		presetOptions,
		value,
		onChange,
	} = props;

	// Whether value is a preset value state
	const [hasCustomValue, setHasCustomValue] = useState(
		value !== undefined && !isPresetValue(value, presetOptions)
	);

	/**
	 * Format string for select control
	 *
	 * @param {(string|number)} [value]
	 * @param {TypeDefs.PresetSelectControlOptionValues} [preset_options]
	 * @returns {TypeDefs.PresetOptionValue}
	 */
	const selectControlValue = (value, preset_options) => {
		return presetValue(value, preset_options);
	};

	/**
	 * Format string for text control
	 *
	 * @param {(string|number)} [value]
	 * @returns {String}
	 */
	const textControlValue = (value) => {
		value = typeof value === 'number' ? value.toString() : value || '';
		// Convert default preset value to empty string
		return value.trim() === DEFAULT_PRESET_VALUE ? '' : value;
	};

	/**
	 * Format string for range control
	 *
	 * @param {(string|number)} [value]
	 * @param {Number} [default_value]
	 * @returns {Number}
	 */
	const rangeControlValue = (value, default_value) => {
		// Convert value to a number value
		if (value === undefined) {
			value = NaN;
		} else if (typeof value === 'string') {
			value = parseFloat(value);
		}

		return Number.isNaN(value) ? default_value || 0 : value;
	};

	/**
	 * Event handlers
	 */

	/**
	 * Select control value change event handler
	 *
	 * @param {String} value
	 */
	const onSelectControlChange = (value) => {
		if (hasCustomValue) {
			return;
		}

		onChange?.(value === DEFAULT_PRESET_VALUE ? null : value);
	};

	/**
	 * Text control value change event handler
	 *
	 * @param {String} [value]
	 */
	const onTextChange = (value) => {
		if (!hasCustomValue || withRange) {
			return;
		}

		// Set default preset value to null
		onChange?.(
			value === undefined || value.trim() === DEFAULT_PRESET_VALUE
				? null
				: value
		);
	};

	/**
	 * Range control value change event handler
	 *
	 * @param {Number} [value]
	 */
	const onRangeChange = (value) => {
		if (!hasCustomValue || !withRange) {
			return;
		}

		onChange?.(value !== undefined ? value.toString() : null);
	};

	/** Custom value toggle button click event handler */
	const onCustomToggleClicked = () => {
		// Update value to a preset value when toggling custom value off
		if (hasCustomValue) {
			const preset_value = presetValue(value, presetOptions);
			onChange?.(
				preset_value === DEFAULT_PRESET_VALUE ? null : preset_value
			);
		}

		setHasCustomValue(!hasCustomValue);
	};

	return (
		<div className="transition-settings-control__item">
			<Icon
				icon={icon || 'admin-tools'}
				size={iconSize || 24}
				className="transition-settings-control__item-icon"
			/>

			{!hasCustomValue && (
				<SelectControl
					label={presetLabel || label}
					hideLabelFromVision
					options={[
						{ label: __('Default'), value: DEFAULT_PRESET_VALUE },
						...(presetOptions || []),
					]}
					value={selectControlValue(value, presetOptions)}
					onChange={onSelectControlChange}
					className="transition-settings-control__item-select"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}

			{hasCustomValue && withRange !== true && (
				<TextControl
					label={customLabel || label}
					hideLabelFromVision
					placeholder={placeholder}
					value={textControlValue(value)}
					onChange={onTextChange}
					className="transition-settings-control__item-text"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}

			{hasCustomValue && withRange === true && (
				<RangeControl
					label={customLabel || label}
					hideLabelFromVision
					initialPosition={rangeInitialPosition}
					min={rangeMin}
					max={rangeMax}
					step={step}
					value={rangeControlValue(value, rangeInitialPosition)}
					onChange={onRangeChange}
					className="transition-settings-control__item-range"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}

			<Button
				label={
					hasCustomValue ? __('Use preset') : __('Set custom value')
				}
				size="small"
				icon={customToggleIcon}
				iconSize={iconSize || 24}
				isPressed={hasCustomValue}
				onClick={onCustomToggleClicked}
				className="transition-control__item-custom-toggle"
			/>
		</div>
	);
}
