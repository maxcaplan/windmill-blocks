import * as TypeDefs from './typedefs';

/**
 * Utility dependencies
 */
import clsx from 'clsx';
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import { presetClassName, presetStringParts } from '@/util/theme';
import {
	duration_options,
	isPresetValue,
	timing_options,
} from '@/components/TransitionSettingsControl/presets';

/**
 * @typedef ButtonProps
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {TypeDefs.WindmillBlocksButtonAttributes} attributes
 * @returns {ButtonProps}
 */
const useButtonBlockPropsInternal = (attributes) => {
	const { ':hover': hover, transition } = attributes;

	// Create map of what attributes the block has
	const has = {
		transition: false,
		hover_color: hover?.color?.text !== undefined,
		hover_background: hover?.color?.background !== undefined,
		transition_duration: transition?.duration !== undefined,
		transition_timing: transition?.timing !== undefined,
	};

	// Check if block has any transition attributes
	has.transition = Object.entries(has).some(([_, value]) => value === true);

	// Create button props
	return {
		className: createClassName(attributes, has),
		style: createStyle(attributes, has),
	};
};

/**
 * Create className string from block attributes
 *
 * @param {TypeDefs.WindmillBlocksButtonAttributes} attributes
 * @param {Record<string, boolean>} [has_attributes]
 * @returns {(string|undefined)}
 */
const createClassName = (attributes, has_attributes) => {
	const { ':hover': hover, transition } = attributes;

	// Create array of 'has' class strings from has map
	let has_classes =
		has_attributes !== undefined
			? Object.entries(has_attributes).map(([key, value]) =>
					value ? `has-${key.replaceAll('_', '-')}` : undefined
				)
			: {};

	// Add preset class strings to array
	has_classes = has_classes.concat([
		presetClassName(hover?.color?.text, 'has', 'hover-color'),
		presetClassName(hover?.color?.background, 'has', 'hover-background'),
		isPresetValue(transition?.duration, duration_options)
			? `has-transition-duration-${transition?.duration || 'none'}`
			: undefined,
		isPresetValue(transition?.timing, timing_options)
			? `has-transition-timing-${transition?.timing}`
			: undefined,
	]);

	// Create className string
	return clsx(has_classes) || undefined;
};

/**
 * Create className string from block attributes
 *
 * @param {TypeDefs.WindmillBlocksButtonAttributes} attributes
 * @param {Record<string, boolean>} [has_attributes]
 * @returns {(import('react').CSSProperties|undefined)}
 */
const createStyle = (attributes, has_attributes) => {
	const { ':hover': hover, transition } = attributes;

	/** @type {import('react').CSSProperties} */
	const styles = {};

	// Hover text color
	if (presetStringParts(hover?.color?.text) === undefined) {
		styles['--wm--block--hover--color'] = hover?.color?.text;
	}

	// Hover background color
	if (presetStringParts(hover?.color?.background) === undefined) {
		styles['--wm--block--hover--background'] = hover?.color?.background;
	}

	// Transition duration
	if (!isPresetValue(transition?.duration, duration_options)) {
		styles['--wm--block--transition--duration'] =
			transition?.duration?.toString() + 'ms';
	}

	// Transition timing function
	if (!isPresetValue(transition?.timing, timing_options)) {
		styles['--wm--block--transition--timing'] = transition?.timing;
	}

	// Transition properties
	if (has_attributes !== undefined) {
		styles['--wm--block--transition--properties'] = Object.entries(
			has_attributes
		)
			.reduce((acc, [key, value]) => {
				if (value === false) {
					return acc;
				}

				if (key.includes('hover_color')) {
					acc.push('color');
				}

				if (key.includes('hover_background')) {
					acc.push('background');
				}

				return acc;
			}, /** @type {string[]} */ ([]))
			.join(',');
	}

	return isEmpty(styles) ? undefined : styles;
};

/**
 * Construct button block props from block attributes
 *
 * @param {TypeDefs.WindmillBlocksButtonAttributes} attributes
 */
const useButtonBlockProps = (attributes) => {
	return useButtonBlockPropsInternal(attributes);
};

/**
 * Construct button block props from block attributes
 *
 * @param {TypeDefs.WindmillBlocksButtonAttributes} attributes
 */
useButtonBlockProps.save = (attributes) => {
	return useButtonBlockPropsInternal(attributes);
};

export default useButtonBlockProps;
