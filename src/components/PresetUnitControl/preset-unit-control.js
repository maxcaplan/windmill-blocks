import * as TypeDefs from './typedefs';

import { useMemo, useState } from 'react';
import clsx from 'clsx';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	SelectControl,
	Button,
	Icon,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { settings as customToggleIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	DEFAULT_PRESET_VALUE,
	isOptionValue,
	optionValue,
} from '@/util/options';
import { useThemeSettings } from '@/hooks/use-theme-settings';
import { presetStringParts } from '@/util/theme';

/**
 * Hooks
 */

/** Get theme unit options */
const useUnitOptions = () => {
	const spacingUnits = useThemeSettings('spacing.units', 'string');
	return spacingUnits.map((unit) => ({
		label: unit,
		value: unit,
	}));
};

/**
 * Select options for presets
 *
 * @param {TypeDefs.PresetObject[]} [presets]
 */
const usePresetOptions = (presets) =>
	useMemo(() => {
		return presets === undefined
			? undefined
			: presets.map((preset) => ({
					label: preset.name,
					value: preset.slug,
				}));
	}, [presets]);

/**
 * Select control value
 *
 * @param {string} [value]
 */
const useSelectControlValue = (value) =>
	useMemo(() => {
		if (value === undefined) {
			return undefined;
		}

		const preset_parts = presetStringParts(value);

		return preset_parts === undefined ? value : preset_parts.slug;
	}, [value]);

/**
 * Unit control value
 *
 * @param {string} [value]
 * @param {TypeDefs.PresetObject[]} [presets]
 */
const useUnitControlValue = (value, presets) =>
	useMemo(() => {
		const preset_slug = presetStringParts(value)?.slug;

		if (preset_slug !== undefined) {
			const preset_value = presets?.find(
				(preset) => preset.slug === preset_slug
			)?.value;
			return preset_value === undefined ? value : preset_value;
		}

		return value;
	}, [value, presets]);

/**
 * Has custom value state
 *
 * @param {string} [value]
 * @param {{ label:string, value:string }[]} [preset_options]
 * @returns {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
 */
const useHasCustomValue = (value, preset_options) => {
	const initial_value = () => {
		if (value === undefined || preset_options === undefined) {
			return false;
		}

		const preset_slug = presetStringParts(value)?.slug;
		value = preset_slug !== undefined ? preset_slug : value;

		return !preset_options.some((option) => option.value === value);
	};

	const [hasCustomValue, setHasCustomValue] = useState(initial_value());

	return [hasCustomValue, setHasCustomValue];
};

/**
 * Components
 */

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.withWrapper]
 * @param {React.ReactNode} props.children
 */
const WithWrapper = ({ className, withWrapper, children }) => {
	if (withWrapper === false) {
		return children;
	}

	return <div className={className}>{children}</div>;
};

/**
 * @param {object} props
 * @param {string} [props.label]
 * @param {"top"|"side"} [props.labelPosition]
 * @param {import('@wordpress/components').IconType} [props.icon]
 * @param {boolean} [props.hideLabelFromVision]
 * @returns
 */
const ControlLabel = ({ label, labelPosition, hideLabelFromVision, icon }) => {
	if (label === undefined) {
		return;
	}

	return (
		<h3
			className={clsx('preset-unit-control__label', {
				'windmill-blocks-visually-hidden':
					hideLabelFromVision === true ||
					(icon !== undefined && labelPosition === 'side'),
			})}
		>
			{label}
		</h3>
	);
};

/**
 * @typedef PresetUnitControlProps
 * @property {string} [label]
 * @property {boolean} [hideLabelFromVision]
 * @property {"top"|"side"} [labelPosition]
 * @property {string} [value]
 * @property {(value?: string|TypeDefs.PresetObject) => void} [onChange]
 * @property {import("@wordpress/components").IconType} [icon]
 * @property {(number)} [iconSize]
 * @property {TypeDefs.PresetObject[]} [presets]
 * @property {TypeDefs.UnitOption[]} [units]
 * @property {boolean} [withWrapper]
 * @property {boolean} [withInnerWrapper]
 */

/**
 * Control for selecting a preset value or inputting a custom value with a unit
 *
 * @param {PresetUnitControlProps} props
 * @returns {React.JSX.Element}
 */
export default function PresetUnitControl(props) {
	const {
		label,
		labelPosition,
		value,
		onChange,
		icon,
		iconSize,
		presets,
		units,
		withWrapper,
		withInnerWrapper,
	} = props;

	/**
	 * Hooks
	 */

	const preset_options = usePresetOptions(presets);
	const select_control_value = useSelectControlValue(value);
	const unit_control_value = useUnitControlValue(value, presets);
	const unit_options = useUnitOptions();

	const [hasCustomValue, setHasCustomValue] = useHasCustomValue(
		value,
		preset_options
	);

	/**
	 * Event Handlers
	 */

	/**
	 * Select control value changed event handler
	 *
	 * @param {string} value
	 */
	const onSelectControlChange = (value) => {
		if (
			value === undefined ||
			value === DEFAULT_PRESET_VALUE ||
			presets === undefined ||
			presets.length <= 0
		) {
			onChange?.(undefined);
			return;
		}

		onChange?.(presets.find((preset) => preset.slug === value));
	};

	/** Custom toggle button clicked event handler */
	const onCustomToggleClicked = () => {
		// Update value to a preset value when toggling custom value off
		if (hasCustomValue) {
			onChange?.(presets?.find((preset) => preset.value === value));
		}

		setHasCustomValue(!hasCustomValue);
	};

	return (
		<WithWrapper withWrapper={withWrapper} className="preset-unit-control">
			{labelPosition !== 'side' && <ControlLabel {...props} />}

			<WithWrapper
				withWrapper={withInnerWrapper}
				className="preset-unit-control__inner-wrapper"
			>
				{(label !== undefined || icon !== undefined) && (
					<div className="preset-unit-control__label-wrapper">
						{labelPosition === 'side' && (
							<ControlLabel {...props} />
						)}

						{icon !== undefined && (
							<Icon
								icon={icon}
								size={iconSize || 24}
								className="preset-unit-control__icon"
							/>
						)}
					</div>
				)}

				<div className="preset-unit-control__control-wrapper">
					{!hasCustomValue && (
						<SelectControl
							label={label}
							hideLabelFromVision
							options={[
								{
									label: __('Default'),
									value: DEFAULT_PRESET_VALUE,
								},
								...(preset_options || []),
							]}
							value={select_control_value}
							onChange={onSelectControlChange}
							className="preset-unit-control__select-control"
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					{hasCustomValue && (
						<UnitControl
							label={label}
							hideLabelFromVision
							value={unit_control_value}
							onChange={onChange}
							units={units === undefined ? unit_options : units}
							className="preset-unit-control__unit-control"
							__next40pxDefaultSize
						/>
					)}

					<Button
						label={
							hasCustomValue
								? __('Use preset')
								: __('Set custom value')
						}
						size="small"
						icon={customToggleIcon}
						iconSize={iconSize || 24}
						isPressed={hasCustomValue}
						onClick={onCustomToggleClicked}
						className="transition-control__item-custom-toggle"
					/>
				</div>
			</WithWrapper>
		</WithWrapper>
	);
}
