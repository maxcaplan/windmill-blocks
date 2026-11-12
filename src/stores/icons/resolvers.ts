import { ICON_STATUS } from './constants';
import { IconThunkArgs } from './types';
import { fetchIconData } from './util';

/**
 * Trigger a fetch for a given icons data if it is unloaded
 */
export const getIcon =
	(name: string) =>
	async ({ select, dispatch }: IconThunkArgs): Promise<void> => {
		// Ensure icon name is a valid string
		if (!name || typeof name !== 'string') {
			return;
		}

		const icon = select._getIconUnresolved(name);

		// Only fetch data if icon status is idle
		if (icon.status !== ICON_STATUS.IDLE) {
			return;
		}

		// Start the resuest
		const request = await dispatch._startIconDataRequest(name);

		try {
			// Receive icon data
			const data = await fetchIconData(icon.data?.name ?? request.name);
			dispatch._receiveIconData(request.name, data, request.request_id);
		} catch (error) {
			// Receive fetch error
			dispatch._receiveIconError(request.name, error, request.request_id);
		}
	};
