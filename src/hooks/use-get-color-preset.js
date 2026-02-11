import { presetStringParts } from '@/util/theme';
import { useSettings } from '@wordpress/block-editor';

/**
 * @typedef ColorPreset
 * @property {string} name
 * @property {string} slug
 * @property {string} color
 */

/**
 * Get color preset hook internal hook
 *
 * @param {boolean} is_editor
 */
function useGetColorPresetInternal(is_editor) {
	/** @returns {(ColorPreset[]|undefined)} */
	const getColorPresets = () => {
		const color_presets = useSettings('color.palette');

		if (
			color_presets.length <= 0 ||
			!Array.isArray(color_presets[0]) ||
			color_presets[0].length <= 0 ||
			typeof color_presets[0][0].name !== 'string' ||
			typeof color_presets[0][0].slug !== 'string' ||
			typeof color_presets[0][0].color !== 'string'
		) {
			return;
		}

		return color_presets[0];
	};

	const color_presets = getColorPresets();

	/**
	 * Return the first color preset object with a color value equal to a given color, and undefined otherwise.
	 *
	 * @param {string} [color] Color to get color preset for
	 * @returns {(ColorPreset|string|undefined)}
	 */
	const getColorPreset = (color) => {
		if (is_editor && color_presets === undefined) {
			console.warn(
				'No theme color palette presets were found in editor data store'
			);
		}

		color = color?.trim();

		if (
			color === undefined ||
			color === '' ||
			color_presets === undefined
		) {
			return color;
		}

		color = presetStringParts(color)?.slug || color;

		return (
			color_presets.find(
				(preset) => preset.color === color || preset.slug === color
			) || color
		);
	};

	return getColorPreset;
}

/**
 * Theme color preset getter hook
 *
 * @example
 *
 * registerBlockType(
 * 	'my-block',
 * 	{
 * 		edit: () => {
 * 			const getColorPreset = useGetColorPreset()
 * 			const bluePresetSlug = getColorPreset("#0000FF")
 * 			return <div className={`has-background-${bluePresetSlug}`} />
 * 		},
 * 		save: () => {
 * 			const getColorPreset = useGetColorPreset.save()
 * 			const bluePresetSlug = getColorPreset("#0000FF")
 * 			return <div className={`has-background-${bluePresetSlug}`} />
 * 		}
 * 	}
 * 	)
 */
const useGetColorPreset = () => {
	return useGetColorPresetInternal(true);
};

/** Theme color preset getter hook */
useGetColorPreset.save = () => {
	return useGetColorPresetInternal(false);
};

export default useGetColorPreset;
