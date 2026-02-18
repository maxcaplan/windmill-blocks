/**
 * Internal dependencies
 */
import { isIconData } from '@/components/InlineIcon/util';

/**
 * Wordpress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Upload an icon svg
 *
 * @param {"POST"|"PUT"} method REST method
 * @param {number} size_limit Upload file size limit
 * @param {File} [file] File to upload
 * @param {string} [name] Name of the uploaded file
 */
export async function uploadIcon(method, size_limit, file, name) {
	// Ensure nonce value is set
	if (wpApiSettings?.nonce === undefined) {
		throw new Error('Invalid credentials.', {
			cause: 'wpApiSettings.nonce is undefined',
		});
	}

	// Ensure file is correct type
	if (file === undefined || file.type !== 'image/svg+xml') {
		throw new Error('Invalid upload file type.');
	}

	// Ensure file is correct size
	if (file.size > size_limit) {
		throw new Error(
			`Max file size of ${Math.round((size_limit / 1048576) * 100) / 100}mb exceeded.`
		);
	}

	// Prepare upload data
	const form_data = new FormData();
	form_data.append('file', file);

	// Register nonce authentication
	apiFetch.use(apiFetch.createNonceMiddleware(wpApiSettings.nonce));

	name = name === undefined ? '' : '/' + name;

	// Upload file
	const result = await apiFetch({
		path: `/windmill-blocks/v1/icons${name}`,
		method,
		body: form_data,
	});

	// Ensure response is valid.
	if (!isIconData(result)) {
		throw new Error('Unknown response.');
	}

	return result;
}
