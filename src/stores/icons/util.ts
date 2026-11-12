import apiFetch from '@wordpress/api-fetch';

import {
	IconData,
	UploadIconArgs,
	IconThunkArgs,
	IconDeleteResponse,
} from './types';
import { UPLOAD_MAX_SIZE } from './constants';
import { slash } from '@/util/text';

/**
 * Returns an icon name for a string value
 */
export const parseIconName = (value: string) => {
	return (
		value
			// Remove file extension
			.replace(/\..+$/, '')
			// Remove whitespace
			.replace(/\s/g, '')
			// Remove special characters except '-' and '_'
			.replace(/[^\w-_]/g, '')
	);
};

/**
 * Returns the provided name with an indexed suffix to prevent store name conflicts
 */
export const getUniqueIconName = (
	name: string,
	select: IconThunkArgs['select']
) => {
	let unique_name = name;
	let name_index = 0;

	const similiar_names = select.nameIncludes(name);

	while (similiar_names.includes(unique_name)) {
		unique_name = `${name}-${++name_index}`;
	}

	return unique_name;
};

/**
 * Check if a value is of type IconData
 */
export const isIconData = (value: any): value is IconData => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	if (typeof value?.name !== 'string') {
		return false;
	}

	if (typeof value?.basename !== 'string') {
		return false;
	}

	if (typeof value?.content !== 'string') {
		return false;
	}

	if (
		typeof value?.modified !== 'undefined' &&
		typeof value?.modified !== 'string'
	) {
		return false;
	}

	return true;
};

const isIconDeleteResponse = (value: any): value is IconDeleteResponse => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	if (typeof value?.name !== 'string') {
		return false;
	}

	return true;
};

/**
 * Fetch icon data for a given icon name
 */
export const fetchIconData = async (name: string) => {
	// Fetch icon data
	const response = await apiFetch({
		path: `/windmill-blocks/v1/icons/${name}`,
		method: 'GET',
	});

	// Ensure response is valid data type
	if (!isIconData(response)) {
		throw new Error('Unknown response.');
	}

	return response;
};

/**
 * Upload an icon file. Replaces file for an icon if a name is given.
 */
export const uploadIconData = async (
	file: File,
	name?: string,
	{ max_file_size = UPLOAD_MAX_SIZE }: UploadIconArgs = {}
) => {
	// Ensure file is correct type
	if (!(file instanceof File) || file.type !== 'image/svg+xml') {
		throw new Error('File is not of type image/svg+xml.');
	}

	// Ensure file is correct size
	if (file.size > max_file_size) {
		throw new Error(
			`Max file size of ${Math.round((max_file_size / 1048576) * 100) / 100}mb exceeded.`
		);
	}

	// Prepare upload data
	const form_data = new FormData();
	form_data.append('file', file);

	// Upload file
	const response = await apiFetch({
		path: `/windmill-blocks/v1/icons${!!name ? slash(name.trim()) : ''}`,
		method: 'POST',
		body: form_data,
	});

	// Ensure response is valid.
	if (!isIconData(response)) {
		throw new Error('Unknown response.');
	}

	return response;
};

/**
 * Delete an icon with a provided name
 */
export const deleteIconData = async (name: string) => {
	name = name.trim();

	if (!name) {
		throw new Error('Invalid icon name.');
	}

	// Delete icon
	const response = await apiFetch({
		path: `/windmill-blocks/v1/icons/${name}`,
		method: 'DELETE',
	});

	// Ensure response is valid.
	if (!isIconDeleteResponse(response)) {
		throw new Error('Unknown response.');
	}

	return response.name;
};
