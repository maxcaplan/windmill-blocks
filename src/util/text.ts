type PluralizeArgs = {
	/** Prefix the given value with the given condition */
	with_prefix?: boolean;
};

type CapitalizeArgs = {
	/** Capitalize all words in string */
	all_words?: boolean;
};

type SlashArgs = {
	/** Slash start of value */
	start?: boolean;
	/** Slash end of value */
	end?: boolean;
};

/**
 * Returns a given value with an "s" appended unless a provided
 * condition is equal to `false` or a number greater or less than 1
 */
export const pluralize = (
	value: string,
	condition?: boolean | number,
	{ with_prefix = false }: PluralizeArgs = {}
): string => {
	const out = with_prefix ? `${condition} ${value}` : value;

	return condition === undefined || condition === true || condition !== 1
		? out + 's'
		: out;
};

/**
 * Uppercase the first letter in a string
 */
export const capitalize: {
	(value: string, args?: CapitalizeArgs): string;
	(value?: undefined, args?: CapitalizeArgs): undefined;
} = (value: any, { all_words = false }: any = {}) => {
	if (value === undefined) {
		return value;
	}

	return all_words
		? value.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase())
		: value.replace(/(^\w|\s\w)/, (m: string) => m.toUpperCase());
};

/**
 * Add a slash to a string value unless there is already one
 */
export const slash = (
	value: string,
	{ start = true, end = false }: SlashArgs = {}
) => {
	if (start && !value.startsWith('/')) {
		value = '/' + value;
	}

	if (end && !value.endsWith('/')) {
		value = value + '/';
	}

	return value;
};

/**
 * Returns a label string for a given filename
 */
export const parseFilenameLabel = (name: string): string => {
	const label = name
		// Replace dashes and underscores with spaces
		.replace(/[-_]/g, ' ')
		// Remove multiple spaces in a row
		.replace(/\s\s+/g, ' ')
		// Remove extension
		.trim();

	const extension_index = label.indexOf('.');

	// Remove file extension if present
	return extension_index > 0 ? label.substring(0, extension_index) : label;
};
