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
