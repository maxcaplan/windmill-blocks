/**
 * Get an error message string for an unknown error value.
 */
export function parseErrorMessage(
	error: unknown,
	unknown_message = 'Unknown error.'
): string {
	let message = '';

	if (error !== undefined && error !== null) {
		if (Error.isError(error)) {
			message = error.message;
		}

		if (typeof error === 'string') {
			message = error;
		}

		if (typeof error === 'object' && typeof error['message'] === 'string') {
			message = error['message'];
		}
	}

	message = message.trim();

	if (message) {
		return message.endsWith('.') ? message : message + '.';
	} else {
		return unknown_message;
	}
}
