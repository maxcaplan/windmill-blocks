/** Wordpress dependencies */
import { __ } from '@wordpress/i18n';

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
 * Static functions
 */

/**
 * Convert a setting number value to a string
 *
 * Returns undefined if number is undefined
 *
 * @param {Number} [value]
 * @returns {(String|undefined)}
 */
const settingNumberToString = (value) => {
	return value?.toString() || undefined;
};

/**
 * Convert a setting string value to a number.
 *
 * Returns undefined if string is undefined not a valid number.
 *
 * @param {(String|null)} value
 * @returns {(Number|undefined)}
 */
const settingStringToNumber = (value) => {
	const num_value = value === null ? NaN : parseInt(value);
	return Number.isNaN(num_value) ? undefined : num_value;
};

const settingStringtoString = (value) => {};

/**
 * Components
 */

/**
 * Block editor transition attribute setting controls
 *
 * @param {Object} props Component props
 * @param {String} [props.label] Control label
 * @param {Boolean} [props.hideLabelFromVision] Visually hide control label
 * @param {Number} [props.durationValue] Transition duration control value
 * @param {(value: Number|null) => void} [props.onDurationChange] Transition duration control onChange event handler
 * @param {String} [props.timingValue] Transition timing function control value
 * @param {(value: String|null) => void} [props.onTimingChange] Transition timing function control onChange event handler
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
	} = props;

	return (
		<div className="transition-settings-control">
			<div
				className={`transition-settings-control__header${hideLabelFromVision ? ' windmill-blocks-visually-hidden' : ''}`}
			>
				<h3 className="transition-settings-control__heading">
					{label || __('Transition')}
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
					value={settingNumberToString(durationValue)}
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
					onChange={(value) =>
						onTimingChange?.(
							value === DEFAULT_PRESET_VALUE ? null : value
						)
					}
				/>
			</div>
		</div>
	);
}
