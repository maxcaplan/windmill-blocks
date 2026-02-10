import { PLUGIN_CSS_VAR_PREFIX } from './constants';

/**
 * Create a css variable name and value for a color preset
 *
 * @example
 * createPresetColorVar('text-color', 'blue')
 * // returns: { '--windmill-blocks--text-color': 'var(--wp--preset--color--blue)' }
 *
 * @example
 * createPresetColorVar('border-color', undefined, '#FFFFFF')
 * // returns: { '--windmill-blocks--border-color': '#FFFFFF' }
 *
 * @example
 * createPresetColorVar(
 * 	'background-color',
 * 	'red',
 * 	undefined
 * 	{
 * 		var_name_prefix: '--my-color--',
 * 		preset_var_name_prefix: '--some-presets--'
 * 	}
 * )
 * // returns: { '--my-color--background-color': 'var(--some-presets--red)' }
 *
 * @param {string} var_slug Slug for css variable
 * @param {string} [color_slug] Slug for color preset
 * @param {string} [custom_color] Custom color value
 * @param {Object} [settings] Variable settings
 * @param {string} [settings.var_name_prefix] Prefix for var name
 * @param {string} [settings.preset_var_name_prefix] Prefix for preset var name
 * @returns {{[key: string]: string|undefined}}
 */
const createPresetColorVar = (var_slug, color_slug, custom_color, settings) => {
	return createPresetColorVarPrivate(
		false,
		var_slug,
		color_slug,
		custom_color,
		settings
	);
};

/**
 * @param {string} var_slug
 * @param {string} [color_slug]
 * @param {string} [custom_color]
 * @param {Object} [settings]
 * @param {string} [settings.var_name_prefix]
 * @param {string} [settings.preset_var_name_prefix]
 * @returns {{[key: string]: string|undefined}}
 */
createPresetColorVar.save = (var_slug, color_slug, custom_color, settings) => {
	return createPresetColorVarPrivate(
		true,
		var_slug,
		color_slug,
		custom_color,
		settings
	);
};

export { createPresetColorVar };

/**
 * @param {Boolean} is_save
 * @param {string} var_slug
 * @param {string} [color_slug]
 * @param {string} [custom_color]
 * @param {Object} [settings]
 * @param {string} [settings.var_name_prefix]
 * @param {string} [settings.preset_var_name_prefix]
 * @returns {{[key: string]: string|undefined}}
 */
const createPresetColorVarPrivate = (
	is_save,
	var_slug,
	color_slug,
	custom_color,
	settings
) => {
	const var_prefix = settings?.var_name_prefix || PLUGIN_CSS_VAR_PREFIX;
	const preset_var_prefix =
		settings?.preset_var_name_prefix || '--wp--preset--color--';

	const var_name = `${var_prefix}${var_slug}`;

	if (is_save) {
		return {
			[var_name]:
				color_slug !== undefined
					? `${preset_var_prefix}${color_slug})`
					: custom_color,
		};
	} else {
		return {
			[var_name]: color_slug
				? `${preset_var_prefix}${color_slug})`
				: custom_color,
		};
	}
};
