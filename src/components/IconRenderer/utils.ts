import {
	allowedIconChildTags,
	allowedIconChildAttributes,
	allowedIconChildAttributesMap,
	AllowedIconChildTag,
	AllowedIconChildAttribute,
} from './constants';

/**
 * Check if a tag name is an allowed icon child element tag name
 */
export const isAllowedIconChild = <Node extends { name: string }>(
	node: Node
): node is Node & { name: AllowedIconChildTag } => {
	return (allowedIconChildTags as readonly string[]).includes(node.name);
};

/**
 * Check if an attribute key is an allowed icon child element attribute key
 */
export const isAllowedIconChildAttribute = <
	Tag extends AllowedIconChildTag,
	Node extends { name: Tag },
>(
	attribute: string,
	node: Node
): attribute is AllowedIconChildAttribute<Tag> => {
	return (
		(allowedIconChildAttributes as readonly string[]).includes(attribute) ||
		(
			allowedIconChildAttributesMap[node.name] as readonly string[]
		).includes(attribute)
	);
};

/**
 * Get all of the allowed attributes for an icon child element
 */
export const getAllowedIconChildAttributes = <
	Tag extends AllowedIconChildTag,
	Node extends { name: Tag; attributes: Record<string, string> },
>(
	node: Node
): Record<AllowedIconChildAttribute<Tag>, unknown> => {
	return Object.entries(node.attributes).reduce(
		(allowed_attributes, [attribute_key, attribute_value]) => {
			if (isAllowedIconChildAttribute(attribute_key, node)) {
				allowed_attributes[attribute_key] = attribute_value;
			}

			return allowed_attributes;
		},
		{} as Record<AllowedIconChildAttribute<Tag>, unknown>
	);
};

/**
 * Normalize fill or stroke attribute color value to 'none', 'currentColor', `undefined`
 */
const normalizeColorValue = (value?: string) => {
	value = value?.trim();

	if (!value) {
		return undefined;
	}

	if (value === 'none') {
		return value;
	}

	return 'currentColor';
};

/**
 * Parse an inline style value string as an object
 */
const parseInlineStyle = (value?: string) => {
	if (typeof value !== 'string') {
		return {};
	}

	try {
		const styles: Record<string, string> = {};
		value.replace(
			/(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g,
			(_, p1: string, p2: string) => (styles[p1.trim()] = p2.trim())
		);

		return styles;
	} catch (_) {
		return {};
	}
};

/**
 * Get normalized fill and stroke attributes for a given node based on it's inline
 * styles and relevent attributes.
 */
export const normalizedFillAndStroke = <
	Node extends { attributes: Record<string, string> },
>(
	node: Node
): Record<string, string | undefined> => {
	const inline_styles = parseInlineStyle(node.attributes['style']);

	const inlineStyleOrAttribute = (key: string): string | undefined =>
		inline_styles[key] ?? node.attributes[key];

	return {
		fill:
			normalizeColorValue(inline_styles['fill']) ??
			normalizeColorValue(node.attributes['fill']),
		stroke:
			normalizeColorValue(inline_styles['stroke']) ??
			normalizeColorValue(node.attributes['stroke']),
		strokeDasharray: inlineStyleOrAttribute('stroke-dasharray'),
		strokeDashoffset: inlineStyleOrAttribute('stroke-dashoffset'),
		strokeLinecap: inlineStyleOrAttribute('stroke-linecap'),
		strokeLinejoin: inlineStyleOrAttribute('stroke-linejoin'),
		strokeMiterlimit: inlineStyleOrAttribute('stroke-miterlimit'),
		strokeWidth: inlineStyleOrAttribute('stroke-width'),
	};
};
