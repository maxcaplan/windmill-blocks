/** Wordpress dependencies */
import { __ } from '@wordpress/i18n';
import { __experimentalToolsPanelItem as ToolPanelItem } from '@wordpress/components';

/** Internal dependencies */
import PresetSettingControl from './preset-setting-control';
import {
	timing_options,
	duration_options,
	DEFAULT_PRESET_VALUE,
} from './presets';

/**
 * Styles
 */
import './style.scss';

/**
 * @typedef TransitionSettingsControlProps
 * @property {string} label Control label
 * @property {Boolean} [hideLabelFromVision] Visually hide control label
 * @property {number} [durationValue] Transition duration control value
 * @property {(value: number|null) => void} [onDurationChange] Transition duration control onChange event handler
 * @property {string} [timingValue] Transition timing function control value
 * @property {(value: string|null) => void} [onTimingChange] Transition timing function control onChange event handler
 * @property {Boolean} [withToolPanelItem]
 * @property {(string|null)} [panelId]
 * @property {boolean} [defaultChecked]
 */

/**
 * Static functions
 */

/**
 * Convert a setting number value to a string
 *
 * Returns undefined if number is undefined
 *
 * @param {Number} [value]
 * @returns {(string|undefined)}
 */
const settingNumberToString = (value) => {
	return value?.toString() || undefined;
};

/**
 * Convert a setting string value to a number.
 *
 * Returns undefined if value is not a valid number.
 *
 * @param {(string|null)} value
 * @returns {(number|undefined)}
 */
const settingStringToNumber = (value) => {
	const num_value = value === null ? NaN : parseInt(value);
	return Number.isNaN(num_value) ? undefined : num_value;
};

/**
 * Components
 */

/**
 * Wrap component with ToolPanelItem component
 *
 * @param {TransitionSettingsControlProps & { children: React.ReactNode }} props
 * @returns
 */
const WithToolPanelItem = (props) => {
	const {
		label,
		durationValue,
		timingValue,
		onDurationChange,
		onTimingChange,
		panelId,
		defaultChecked,
		children,
	} = props;

	const hasValue = (...values) => {
		return values.some((value) => value !== undefined && value !== '');
	};

	const resetAttributes = () => {
		onDurationChange?.(null);
		onTimingChange?.(null);
	};

	return (
		<ToolPanelItem
			label={label}
			hasValue={() => hasValue(durationValue, timingValue)}
			panelId={panelId}
			className={'transition-settings-control__tool-panel-item'}
			defaultChecked={defaultChecked}
			onDeselect={resetAttributes}
			resetAllFilter={resetAttributes}
		>
			{children}
		</ToolPanelItem>
	);
};

/**
 * Block editor transition attribute setting controls
 *
 * @param {TransitionSettingsControlProps} props
 * @returns {React.JSX.Element}
 */
export default function TransitionSettingsControl(props) {
	const {
		label,
		hideLabelFromVision,
		durationValue,
		onDurationChange,
		timingValue,
		onTimingChange,
		withToolPanelItem,
	} = props;

	const component_element = (
		<div className="transition-settings-control">
			<div
				className={`transition-settings-control__header${hideLabelFromVision ? ' windmill-blocks-visually-hidden' : ''}`}
			>
				<h3 className="transition-settings-control__heading">
					{label}
				</h3>
			</div>

			<div className="transition-settings-control__body">
				{/* Transition duration control */}
				<PresetSettingControl
					presetLabel={__('Preset durations')}
					customLabel={__('Custom duration')}
					icon="clock"
					iconSize={24}
					presetOptions={duration_options}
					value={durationValue}
					onChange={(value) => {
						const num_value = settingStringToNumber(value);
						onDurationChange?.(
							num_value === undefined ? null : num_value
						);
					}}
					withRange
					rangeInitialPosition={500}
					rangeMin={0}
					rangeMax={5000}
					step={50}
				/>

				{/* Transition timing function control */}
				<PresetSettingControl
					presetLabel={__('Preset timing functions')}
					customLabel={__('Custom timing function')}
					placeholder={__('Timing function...')}
					icon="controls-play"
					iconSize={24}
					presetOptions={timing_options}
					value={timingValue}
					onChange={(value) => {
						onTimingChange?.(
							value === DEFAULT_PRESET_VALUE ? null : value
						);
					}}
				/>
			</div>
		</div>
	);

	// Conditionally wrap component with ToolPanelItem component
	if (withToolPanelItem) {
		return (
			<WithToolPanelItem {...props}>
				{component_element}
			</WithToolPanelItem>
		);
	} else {
		return component_element;
	}
}
