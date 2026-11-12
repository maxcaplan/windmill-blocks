import { keyedReducer } from '@wordpress/data';

import { ACTION_TYPE, EMPTY_ICON, ICON_STATUS } from './constants';
import { Icon, ReducerAction } from './types';

/**
 * Icon store state reducer.
 * The icon store state is an object where each key is an icon name,
 * and each value is an icon object
 */
const reducer = keyedReducer<Icon, ReducerAction>('name')((
	/** Current icon data state */
	state = EMPTY_ICON,
	/** Dispatched action */
	action
) => {
	switch (action.type) {
		case ACTION_TYPE.START_ICON_REQUEST:
			// Set status loading or refreshing depending on current
			// data, and remove any errors
			return {
				...state,
				status: !!state.data
					? ICON_STATUS.REFRESHING
					: ICON_STATUS.LOADING,
				error: null,
				request_id: action.request_id,
			};

		case ACTION_TYPE.FAIL_ICON_REQUEST:
			// Ignore responses from stale requests
			if (action.request_id !== state.request_id) {
				return state;
			}

			// Set status to error and set error value
			return {
				...state,
				status: ICON_STATUS.ERROR,
				error: action.error,
			};

		case ACTION_TYPE.SUCCEED_ICON_REQUEST:
			// Ignore responses from stale requests
			if (action.request_id !== state.request_id) {
				return state;
			}

			// Update icon data, set status to loaded, and clear
			// any errors
			return {
				...state,
				data: action.data,
				status: ICON_STATUS.LOADED,
				error: null,
				is_deleted: false,
				request_id: action.request_id,
			};

		case ACTION_TYPE.DELETE_ICON:
			// Remove icon data and, clear error, and reset status
			return {
				...state,
				status: ICON_STATUS.IDLE,
				data: null,
				error: null,
				is_deleted: true,
				request_id: undefined,
			};

		default:
			return state;
	}
});

export default reducer;
