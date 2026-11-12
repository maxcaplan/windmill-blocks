import { ThunkArgs } from '@wordpress/data';

import { ACTION_TYPE, ICON_STATUS } from './constants';
import { store as iconStore } from './index';

export interface IconData {
	name: string;
	basename: string;
	content: string;
	modified?: string;
}

export interface IconDeleteResponse {
	name: string;
}

export interface Icon {
	data: IconData | null;
	status: ICON_STATUS;
	error: unknown;
	is_deleted?: boolean;
	request_id?: number;
}

export type IconStoreState = Record<string, Icon>;

export type ReducerAction =
	| {
			type: ACTION_TYPE.START_ICON_REQUEST;
			name: string;
			request_id: number;
	  }
	| {
			type: ACTION_TYPE.FAIL_ICON_REQUEST;
			name: string;
			error: unknown;
			request_id: number;
	  }
	| {
			type: ACTION_TYPE.SUCCEED_ICON_REQUEST;
			name: string;
			data: IconData;
			request_id: number;
	  }
	| {
			type: ACTION_TYPE.DELETE_ICON;
			name: string;
	  };

export type IconThunkArgs = ThunkArgs<typeof iconStore>;

export interface RecieveIconErrorArgs {
	/** Error notice arguments. Setting to null removes notice */
	notice_args?: {
		content?: string;
		/** Defaults to icon store context */
		context?: string;
		/** Defaults to icon name */
		id?: string;
		type?: 'default' | 'snackbar';
		isDismissible?: boolean;
		explicitDismiss?: boolean;
		actions?: {
			label: string;
			onClick?: () => void;
			url?: string;
		}[];
		speak?: boolean;
	} | null;
}

export interface UploadIconArgs {
	max_file_size?: number;
}
