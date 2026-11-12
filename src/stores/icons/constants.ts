import { Icon } from './types';

export const STORE_NAME = 'wm-blocks/icons' as const;

export const context = STORE_NAME;

/** Maximum upload file size of 5mb in binary bytes */
export const UPLOAD_MAX_SIZE = 5242880;

export enum ACTION_TYPE {
	START_ICON_REQUEST = 'START_ICON_DATA_REQUEST',
	FAIL_ICON_REQUEST = 'FAIL_ICON_DATA_REQUEST',
	SUCCEED_ICON_REQUEST = 'SUCCEED_ICON_DATA_REQUEST',
	DELETE_ICON = 'DELETE_ICON',
}

export enum ICON_STATUS {
	IDLE = 'idle',
	LOADING = 'loading',
	REFRESHING = 'refreshing',
	LOADED = 'loaded',
	ERROR = 'error',
}

export const EMPTY_ICON = Object.freeze<Icon>({
	status: ICON_STATUS.IDLE,
	error: null,
	data: null,
});
