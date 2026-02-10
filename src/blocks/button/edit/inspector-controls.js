import * as TypeDefs from '../typedefs';

import { useEffect, useState } from 'react';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import {
	InspectorAdvancedControls,
	InspectorControls,
	// @ts-ignore
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	// @ts-ignore
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { TransitionSettingsControl } from '@/components';
import { useGetColorPreset, useSetObjectAttribute } from '@/hooks';
import { propertyOrValue } from '@/util/objects';
import { createPresetString, presetStringParts } from '@/util/theme';

/**
 * @typedef {(import('@/hooks/use-get-color-preset').ColorPreset|string|undefined)} ColorStateValue
 */

/**
 * Static functions
 */

/**
 * @param {ColorStateValue} color
 * @returns {string|undefined}
 */
const getColorValue = (color) => {
	return propertyOrValue(color, 'color');
};

/**
 * @param {ColorStateValue} color
 * @returns {string|undefined}
 */
const parseColorPreset = (color) => {
	// Return color if it is not a color preset object
	if (color === undefined || typeof color === 'string') {
		return color;
	}
	// Create preset string for color preset slug
	return createPresetString(color.slug, 'color');
};

/**
 * Button block editor inspector controls component
 *
 * @param {TypeDefs.WindmillBlocksButtonEditProps} props
 * @returns {React.JSX.Element}
 */
export default function ButtonInspectorControls(props) {
	const { attributes, setAttributes, clientId } = props;
	const { ':hover': hover } = attributes;

	/**
	 * Hooks
	 */

	/** ':hover' attribute setter */
	const setHoverAttribute = useSetObjectAttribute(props, ':hover');

	/** Theme color preset getter */
	const getColorPreset = useGetColorPreset();

	/** Color gradient dropdown control settings */
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	/**
	 * State
	 */

	/** Hover text color state */
	const [hoverTextColor, setHoverTextColor] = useState(
		getColorPreset(
			presetStringParts(hover?.color?.text)?.slug || hover?.color?.text
		)
	);

	/** Hover background color state */
	const [hoverBackgroundColor, setHoverBackgroundColor] = useState(
		getColorPreset(
			presetStringParts(hover?.color?.background)?.slug ||
				hover?.color?.background
		)
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		const text_value = parseColorPreset(hoverTextColor);
		const background_value = parseColorPreset(hoverBackgroundColor);

		const color = {};

		if (text_value !== hover?.color?.text) {
			color.text = text_value || null;
		}

		if (background_value !== hover?.color?.background) {
			color.background = background_value || null;
		}

		if (Object.entries(color).length > 0) {
			setHoverAttribute({ color });
		}
	}, [hoverTextColor, hoverBackgroundColor]);

	return (
		<>
			{/* Inspector */}
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					panelId={clientId}
					settings={[
						{
							label: __('Text hover'),
							colorValue: getColorValue(hoverTextColor),
							clearable: true,
							enableAlpha: true,
							onColorChange: (value) => {
								setHoverTextColor(getColorPreset(value));
							},
							resetAllFilter: () => {
								setHoverTextColor(undefined);
							},
						},
						{
							label: __('Background hover'),
							colorValue: getColorValue(hoverBackgroundColor),
							clearable: true,
							enableAlpha: true,
							onColorChange: (value) => {
								setHoverBackgroundColor(getColorPreset(value));
							},
							resetAllFilter: () => {
								setHoverTextColor(undefined);
							},
						},
					]}
					disableCustomColors={false}
					{...colorGradientSettings}
				/>

				<TransitionSettingsControl
					label={__('Hover Transition')}
					durationValue={hover?.color?.transition?.duration}
					onDurationChange={(value) => {
						setHoverAttribute({
							color: {
								transition: {
									duration: value,
								},
							},
						});
					}}
					timingValue={hover?.color?.transition?.timing}
					onTimingChange={(value) => {
						setHoverAttribute({
							color: {
								transition: { timing: value },
							},
						});
					}}
					withToolPanelItem
					panelId={clientId}
					defaultChecked={false}
				/>
			</InspectorControls>

			<InspectorAdvancedControls>
				<SelectControl
					label={__('HTML Element')}
					options={[
						{ value: 'button', label: __('Default(<button>)') },
						{ value: 'a', label: '<a>' },
					]}
					value={
						attributes.tagName === 'a' ||
						attributes.tagName === 'button'
							? attributes.tagName
							: 'button'
					}
					onChange={(value) => setAttributes({ tagName: value })}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</InspectorAdvancedControls>
		</>
	);
}
