/**
 * @typedef {Exclude<import("@wordpress/blocks").BlockConfiguration["icon"], undefined>} BlockIcon
 */

/**
 * @typedef DefaultVariantMetadata
 * @property {string} title
 * @property {BlockIcon} icon
 */

/**
 * @typedef VariantMetadata
 * @property {string} [name]
 * @property {string} [title]
 * @property {BlockIcon} [icon]
 */

/**
 * @callback GetIconCallback
 * @param {string} className
 * @returns {BlockIcon}
 */

/**
 * @callback GetTitleCallback
 * @param {string} className
 * @returns {string|undefined}
 */

/**
 * @typedef { Record<string, VariantMetadata> & {
 * 	__default: DefaultVariantMetadata,
 * 	getIcon: GetIconCallback,
 * 	getTitle: GetTitleCallback
 * }} VariationsMetadata
 */

/**
 * @param {any} metadata
 * @param {{[name: string]: BlockIcon|undefined} & { default: BlockIcon }} icons
 * @returns {VariantMetadata|undefined}
 */
export function parseVariationsMetadata(metadata, icons) {
	if (
		metadata === undefined ||
		metadata === null ||
		Array.isArray(metadata) ||
		typeof metadata !== 'object' ||
		!Object.hasOwn(metadata, 'name') ||
		!Object.hasOwn(metadata, 'title')
	) {
		return undefined;
	}

	const variation_metadata = {
		__default: { icon: icons.default, title: metadata['title'] },
		getTitle(className) {
			return this[className]?.title;
		},
		getIcon(className) {
			return this[className]?.icon || this.__default.icon;
		},
	};

	const variations = metadata['variations'];

	if (
		variations === undefined ||
		variations === null ||
		!Array.isArray(variations)
	) {
		/** @ts-ignore */
		return variation_metadata;
	}

	variations.forEach((variant) => {
		if (
			variant !== undefined &&
			variant !== null &&
			!Array.isArray(variant) &&
			typeof variant !== 'object' &&
			Object.hasOwn(variant, 'attributes') &&
			Object.hasOwn(variant['attributes'], 'className') &&
			typeof variant['attributes']['className'] === 'string'
		) {
			variation_metadata[variant['attributes']['className']] = {
				name:
					typeof variant['name'] === 'string'
						? variant['title']
						: undefined,
				title:
					typeof variant['title'] === 'string'
						? variant['title']
						: undefined,
				icon: icons[variant['name']],
			};
		}
	});

	/** @ts-ignore */
	return variation_metadata;
}
