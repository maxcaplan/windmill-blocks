import * as TypeDefs from './typedefs';

import { useState } from 'react';
import clsx from 'clsx';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { link as linkIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import PresetUnitControl from './preset-unit-control';

/**
 * Typedefs
 */

/**
 * @typedef PresetAxis
 * @property {string} label
 * @property {string} [value]
 * @property {(value?: string|number) => void} [onChange]
 * @property {boolean} [hideLabelFromVision]
 * @property {import("@wordpress/components").IconType} [icon]
 */

/**
 * @typedef PresetUnitAxisProps
 * @property {import("@wordpress/components").IconType} [icon]
 * @property {number} [iconSize]
 * @property {TypeDefs.PresetObject[]} [presets]
 * @property {TypeDefs.UnitOption[]} [units]
 */

/**
 * @typedef PresetUnitAxesControlProps
 * @property {string} [label]
 * @property {boolean} [hideLabelFromVision]
 * @property {import("@wordpress/components").IconType} [icon]
 * @property {number} [iconSize]
 * @property {PresetAxis[]} [axes]
 * @property {TypeDefs.PresetObject[]} [presets]
 * @property {TypeDefs.UnitOption[]} [units]
 */

/**
 * Components
 */

/**
 * @param {PresetAxis & PresetUnitAxisProps} props
 */
function PresetUnitAxisControl(props) {
	return (
		<PresetUnitControl
			{...props}
			labelPosition="side"
			withWrapper={false}
			withInnerWrapper={false}
		/>
	);
}

/**
 * @param {PresetUnitAxesControlProps} props
 * @returns {React.JSX.Element}
 */
export default function PresetUnitAxesControl(props) {
	const { label, hideLabelFromVision, icon, iconSize, axes, presets, units } =
		props;

	/**
	 * Functions
	 */

	/**
	 * Check if axes is defined and has 1 or more entries
	 *
	 * @param {PresetAxis[]} [axes]
	 * @returns {axes is PresetAxis[]}
	 */
	const hasAxis = (axes) => {
		return axes !== undefined && axes.length > 0;
	};

	/**
	 * Check if axes is defined and has 2 or more entries
	 *
	 * @param {PresetAxis[]} [axes]
	 * @returns {axes is PresetAxis[]}
	 */
	const hasMultipleAxes = (axes) => {
		return axes !== undefined && axes.length > 1;
	};

	/**
	 * Check if all properties in a value have the same value
	 *
	 * @param {PresetAxis[]} [axes]
	 */
	const hasEqualAxes = (axes) => {
		if (!hasMultipleAxes(axes)) {
			return true;
		}

		const first_value = axes[0].value;

		for (let axis_idx = 1; axis_idx < axes.length; axis_idx++) {
			if (axes[axis_idx].value !== first_value) {
				return false;
			}
		}

		return true;
	};

	/**
	 * State
	 */

	const [isLinked, setIsLinked] = useState(hasEqualAxes(axes));

	/**
	 * Computed values
	 */

	/**
	 * Get value of first axis for all axes
	 *
	 * @param {PresetAxis[]} [axes]
	 */
	const firstAxisValue = (axes) => {
		if (!hasAxis(axes)) {
			return undefined;
		}

		return axes[0].value;
	};

	/**
	 * Event Handlers
	 */

	/**
	 * Linked preset control value changed
	 *
	 * @param {string|number} [axis_value]
	 */
	const onLinkedValueChange = (axis_value) => {
		if (!hasAxis(axes)) {
			return;
		}

		axes.forEach((axis) => {
			if (axis.value !== axis_value) {
				axis.onChange?.(axis_value);
			}
		});
	};

	/**
	 * Linked toggle button clicked event handler
	 */
	const onLinkTogglePressed = () => {
		if (!hasMultipleAxes(axes)) {
			setIsLinked(true);
		}

		// If toggling to linked value, set all values to first axis' value
		if (!isLinked && hasAxis(axes)) {
			onLinkedValueChange(axes[0].value);
		}

		setIsLinked(!isLinked);
	};

	return (
		<fieldset className="preset-unit-control preset-unit-axis-control">
			<div className="preset-unit-control__header">
				{label && (
					<legend
						className={clsx('preset-unit-control__label', {
							'windmill-blocks-visually-hidden':
								hideLabelFromVision,
						})}
					>
						{label}
					</legend>
				)}

				{hasMultipleAxes(axes) && (
					<Button
						icon={linkIcon}
						label={isLinked ? __('Unlink sides') : __('Link sides')}
						size="small"
						iconSize={24}
						isPressed={!isLinked}
						onClick={onLinkTogglePressed}
						className="preset-unit-control__link-button-toggle"
					/>
				)}
			</div>

			{(isLinked === true || !hasMultipleAxes(axes)) && (
				<PresetUnitControl
					icon={icon}
					iconSize={iconSize}
					value={firstAxisValue(axes)}
					onChange={onLinkedValueChange}
					presets={presets}
					units={units}
					withWrapper={false}
					withInnerWrapper={false}
				/>
			)}
			{isLinked !== true &&
				hasMultipleAxes(axes) &&
				axes.map((axis) => (
					<PresetUnitAxisControl
						{...axis}
						key={`control-axis-${axis.label}`}
						iconSize={iconSize}
						presets={presets}
						units={units}
					/>
				))}
		</fieldset>
	);
}
