import * as TypeDefs from '../typedefs';

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
import { createPresetString } from '@/util/theme';

/**
 * Button block editor inspector controls component
 *
 * @param {TypeDefs.WindmillBlocksButtonEditProps} props
 * @returns {React.JSX.Element}
 */
export default function ButtonInspectorControls(props) {
	const { attributes, setAttributes, clientId } = props;
	const { ':hover': hover, transition } = attributes;

	/**
	 * Hooks
	 */

	/** ':hover' attribute setter */
	const setHoverAttribute = useSetObjectAttribute(props, ':hover');
	/** transition attribute setter */
	const setTransitionAttribute = useSetObjectAttribute(props, 'transition');

	/** Theme color preset getter */
	const getColorPreset = useGetColorPreset();

	/** Color gradient dropdown control settings */
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	/**
	 * Functions
	 */

	/**
	 * Returns color value string for a hover attribute color, and undefined otherwise
	 *
	 * @param {(string|undefined)} value
	 */
	const hoverColorValue = (value) => {
		// Get color preset for value
		let preset = getColorPreset(value);

		// If color is preset, get preset color value
		if (preset !== undefined && typeof preset !== 'string') {
			preset = preset.color;
		}

		return preset;
	};

	/**
	 * Event Handlers
	 */

	/**
	 * Hover color control value change event handler
	 *
	 * @param {any} value
	 * @param {keyof TypeDefs.WindmillBlocksButtonHoverColor} color_key
	 */
	const onHoverColorChange = (value, color_key) => {
		// Get color preset for value
		let preset = getColorPreset(value);

		// If color is preset, get preset variable string
		if (preset !== undefined && typeof preset !== 'string') {
			preset = createPresetString(preset.slug, 'color');
		}

		// Set hover color attribute value
		setHoverAttribute({
			color: {
				[color_key]: preset || null,
			},
		});
	};

	return (
		<>
			{/* Inspect Color Panel */}
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					panelId={clientId}
					settings={[
						{
							label: __('Text hover'),
							colorValue: hoverColorValue(hover?.color?.text),
							clearable: true,
							enableAlpha: true,
							onColorChange: (value) => {
								onHoverColorChange(value, 'text');
							},
							resetAllFilter: () => {
								setHoverAttribute({
									color: {
										text: null,
									},
								});
							},
						},
						{
							label: __('Background hover'),
							colorValue: hoverColorValue(
								hover?.color?.background
							),
							clearable: true,
							enableAlpha: true,
							onColorChange: (value) => {
								onHoverColorChange(value, 'background');
							},
							resetAllFilter: () => {
								setHoverAttribute({
									color: {
										background: null,
									},
								});
							},
						},
					]}
					disableCustomColors={false}
					{...colorGradientSettings}
				/>

				<TransitionSettingsControl
					label={__('Hover Transition')}
					durationValue={transition?.duration}
					onDurationChange={(value) => {
						setTransitionAttribute({
							duration: value,
						});
					}}
					timingValue={transition?.timing}
					onTimingChange={(value) => {
						setTransitionAttribute({
							timing: value,
						});
					}}
					withToolPanelItem
					panelId={clientId}
					defaultChecked={false}
				/>
			</InspectorControls>

			{/* Inspector Advanced Panel */}
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
