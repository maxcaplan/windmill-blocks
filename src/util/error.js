const UNKNOWN_ERROR_MESSAGE = 'Unknown error.';

/**
 * Get an error message string for an unknown error value
 *
 * @param {unknown} err
 */
export function parseErrorMessage(err) {
	if (err === undefined || err === null) {
		return UNKNOWN_ERROR_MESSAGE;
	}

	if (Error.isError(err)) {
		return err.message;
	}

	if (typeof err === 'string') {
		return err;
	}

	if (
		typeof err === 'object' &&
		Object.hasOwn(err, 'message') &&
		typeof err['message'] === 'string'
	) {
		return err['message'];
	}

	return UNKNOWN_ERROR_MESSAGE;
}
