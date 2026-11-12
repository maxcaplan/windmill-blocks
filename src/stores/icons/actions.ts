import { truncate } from 'lodash';

import { store as noticeStore } from '@wordpress/notices';
import { __, sprintf } from '@wordpress/i18n';

import { parseErrorMessage } from '@/util/error';

import { ACTION_TYPE, context } from './constants';
import {
	IconData,
	ReducerAction,
	IconThunkArgs,
	RecieveIconErrorArgs,
} from './types';
import {
	fetchIconData,
	uploadIconData,
	deleteIconData,
	getUniqueIconName,
	parseIconName,
} from './util';

/**
 * Unique id number iterator
 */
function* getUniqueId(): Iterator<number, number> {
	let id = 0;
	while (true) {
		yield id++;
	}
}

/** Request ID iterator */
let requestId = getUniqueId();

/**
 * PRIVATE ACTION.
 *
 * Returns an aciton object used in signaling a new icon data request
 */
export const _startIconDataRequest = (
	name: string
): Extract<ReducerAction, { type: ACTION_TYPE.START_ICON_REQUEST }> => ({
	type: ACTION_TYPE.START_ICON_REQUEST,
	name,
	// Generate a new request id
	request_id: requestId.next().value,
});

/**
 * PRIVATE ACTION.
 *
 * Returns an aciton object used in signaling a failed icon data request
 */
export const _failIconDataRequest = (
	name: string,
	error: unknown,
	request_id: number
): Extract<ReducerAction, { type: ACTION_TYPE.FAIL_ICON_REQUEST }> => ({
	type: ACTION_TYPE.FAIL_ICON_REQUEST,
	name,
	error,
	request_id,
});

/**
 * PRIVATE ACTION.
 *
 * Returns an aciton object used in signaling a succeeded icon data request
 */
export const _succeedIconDataRequest = (
	name: string,
	data: IconData,
	request_id: number
): Extract<ReducerAction, { type: ACTION_TYPE.SUCCEED_ICON_REQUEST }> => ({
	type: ACTION_TYPE.SUCCEED_ICON_REQUEST,
	name,
	data,
	request_id,
});

/**
 * PRIVATE ACITON.
 *
 * Receive an error for an icon data request
 */
export const _receiveIconError =
	(
		name: string,
		error: unknown,
		request_id: number,
		{ notice_args }: RecieveIconErrorArgs = {}
	) =>
	async ({ select, dispatch, registry }: IconThunkArgs) => {
		const icon = select._getIconUnresolved(name);

		// Ignore errors from stale requests
		if (icon.request_id !== request_id) {
			return;
		}

		// Fail the request
		await dispatch._failIconDataRequest(name, error, request_id);

		if (notice_args === null) {
			return;
		}

		// Create an error notice for the icon
		registry
			.dispatch(noticeStore)
			.createErrorNotice(
				notice_args?.content ??
					`Failed to load icon "${name}": ${parseErrorMessage(error)}`,
				{
					context,
					id: notice_args?.id ?? name,
					type: notice_args?.type ?? 'default',
					isDismissible: notice_args?.isDismissible ?? true,
					actions: notice_args?.actions,
					speak: notice_args?.speak,
					__unstableHTML: true,
				}
			);
	};

/**
 * PRIVATE ACTION.
 *
 * Receive data for an icon data request
 */
export const _receiveIconData =
	(name: string, data: IconData, request_id: number) =>
	async ({ select, dispatch, registry }: IconThunkArgs) => {
		const icon = select._getIconUnresolved(name);

		// Ignore data from stale requests
		if (icon.request_id !== request_id) {
			return;
		}

		// Succeed the request
		await dispatch._succeedIconDataRequest(name, data, request_id);

		// Remove error notice for icon
		registry.dispatch(noticeStore).removeNotice(name, context);
	};

/**
 * Get data for a provieded icon
 */
export const getIconData =
	(name: string) =>
	async ({ resolveSelect }: IconThunkArgs) =>
		(await resolveSelect.getIcon(name)).data;

/**
 * Trigger a refetch for a given icons data
 */
export const refetchIconData =
	(name: string) =>
	async ({ select, dispatch }: IconThunkArgs) => {
		const request = await dispatch._startIconDataRequest(name);
		const icon = select._getIconUnresolved(name);

		try {
			const data = await fetchIconData(icon.data?.name ?? request.name);
			dispatch._receiveIconData(request.name, data, request.request_id);
		} catch (error) {
			dispatch._receiveIconError(request.name, error, request.request_id);
		}
	};

/**
 * Upload one or more icon files to the library
 */
export const uploadIcons =
	(files: File | File[]) =>
	async ({ select, dispatch }: IconThunkArgs) => {
		files = Array.isArray(files) ? files : [files];

		const responses = (async () => {
			const results: IconData[] = [];
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				const name = getUniqueIconName(
					parseIconName(file.name),
					select
				);

				const request = await dispatch._startIconDataRequest(name);

				try {
					const data = await uploadIconData(file);
					await dispatch._receiveIconData(
						request.name,
						data,
						request.request_id
					);
					results.push(data);
				} catch (error) {
					await dispatch._receiveIconError(
						request.name,
						error,
						request.request_id,
						{
							notice_args: {
								content: sprintf(
									/* translators: %s: filename. */
									__('Upload failed — %s', 'windmill-data'),
									truncate(file.name, {
										length: 40,
										omission: '…',
									})
								),
								id: request.name + '/replace',
								type: 'snackbar',
								explicitDismiss: true,
							},
						}
					);
				}
			}

			return results;
		})();

		return {
			names: files.map((file) => parseIconName(file.name)),
			data: responses,
		};
	};

/**
 * Delete an icon with a provided name
 */
export const deleteIcon = (name: string) => async () => deleteIconData(name);

/**
 * Replace a provide icons content with a provided file
 */
export const replaceIcon =
	(name: string, file: File) =>
	async ({ dispatch }: IconThunkArgs) => {
		const request = await dispatch._startIconDataRequest(name);

		try {
			const data = await uploadIconData(file, name.trim());
			await dispatch._receiveIconData(
				request.name,
				data,
				request.request_id
			);
		} catch (error) {
			await dispatch._receiveIconError(
				request.name,
				error,
				request.request_id,
				{
					notice_args: {
						content: sprintf(
							/* translators: %s: filename. */
							__('Upload failed — %s', 'windmill-data'),
							truncate(file.name, {
								length: 40,
								omission: '…',
							})
						),
						id: request.name + '/replace',
						type: 'snackbar',
						explicitDismiss: true,
					},
				}
			);
		}
	};
