/**
 * Wordpress theme utility functions
 */

/**
 * Return a theme preset string for a given slug string, and undefined otherwise
 *
 * @example
 * createPresetString('primary', 'color') // returns: 'var:preset|color|primary'
 * createPresetString('foobar') // returns: 'var:preset|foobar'
 *
 * @param {string} [slug]
 * @param {string} [preset_type]
 */
export function createPresetString(slug, preset_type) {
	if (slug === undefined) {
		return;
	}
	preset_type = preset_type ? preset_type + '|' : '';
	return `var:preset|${preset_type.trim()}${slug.trim()}`;
}

/**
 * Return parts of a preset string
 *
 * @example
 * presetStringParts("var:preset|color|primary") // returns: { preset: 'color', slug: 'primary' }
 * presetStringParts("var:preset|color") // returns: { preset: 'color' }
 * presetStringParts("var:color") // returns: undefined
 *
 * @param {string} [preset_string]
 * @returns {({preset?: string, slug?: string}|undefined)}
 */
export function presetStringParts(preset_string) {
	preset_string = preset_string?.trim();

	if (!preset_string || !preset_string.startsWith('var:preset|')) {
		return;
	}

	const [preset, slug] = preset_string.slice(11).split('|');
	return { preset: preset || undefined, slug: slug || undefined };
}

/**
 * Create a class name for a preset string
 *
 * @param {string} [preset]
 * @param {string} [prefix]
 * @param {string} [suffix]
 * @returns {(string|undefined)}
 */
export function presetClassName(preset, prefix, suffix) {
	const preset_parts = presetStringParts(preset);

	if (
		preset_parts === undefined ||
		preset_parts.preset === undefined ||
		preset_parts.slug === undefined
	) {
		return undefined;
	}

	prefix = prefix === undefined ? '' : `${prefix}-`;
	suffix = suffix === undefined ? '' : `-${suffix}`;

	return `${prefix}${preset_parts.slug}${suffix}`;
}

/**
 * Create a css property value for a preset string
 *
 * @example
 * presetStyleValue("var:preset|color|red") // returns: "var(--wp--preset--color--red)"
 * presetStyleValue("#FF0000") // returns: "#FF0000"
 * presetStyleValue("var:preset|color|red", { only_custom: true }) // returns: undefined
 * presetStyleValue("#FF0000", { only_preset: true }) // returns: undefined
 * presetStyleValue(1000, { custom_suffix: "ms" }) // returns: "1000ms"
 *
 * @param {(string|number)} [value]
 * @param {object} [settings]
 * @param {string} [settings.custom_prefix] String prepended to custom values
 * @param {string} [settings.custom_suffix] String appended to custom values
 * @param {boolean} [settings.only_custom] Only return custom values
 * @param {boolean} [settings.only_preset] Only return preset values
 */
export function presetStyleValue(value, settings) {
	if (value === undefined) {
		return undefined;
	}

	const only_preset = settings?.only_preset;
	const only_custom = settings?.only_custom;
	const custom_prefix = settings?.custom_prefix || '';
	const custom_suffix = settings?.custom_suffix || '';

	const parts =
		typeof value === 'number' ? undefined : presetStringParts(value);

	if (
		parts === undefined ||
		parts.preset === undefined ||
		parts.slug === undefined
	) {
		// Value is not a preset
		return only_preset && !only_custom
			? undefined
			: custom_prefix + value + custom_suffix;
	}

	// Value is a preset
	return only_custom
		? undefined
		: `var(--wp--preset--${parts.preset}--${parts.slug})`;
}
