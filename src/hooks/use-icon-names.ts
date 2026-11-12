import { useEffect, useMemo, useReducer } from 'react';

import apiFetch from '@wordpress/api-fetch';

export interface IconNamesResponse {
	icons: string[];
}

export type IconNamesErrorCallback = (error: unknown) => void;
export type IconNamesSuccessCallback = (
	names: IconNamesResponse['icons']
) => void;

enum IconNamesActionType {
	StartRequest = 'start_request',
	FailRequest = 'fail_request',
	ReceiveData = 'receive_data',
}

enum IconNamesStatus {
	Idle = 'idle',
	Loading = 'loading',
	Loaded = 'loaded',
	Error = 'error',
}

interface IconNamesState {
	data: string[];
	status: IconNamesStatus;
	request_id?: number;
	error?: unknown;
}

type IconNamesAction =
	| {
			type: IconNamesActionType.StartRequest;
			request_id: number;
	  }
	| {
			type: IconNamesActionType.FailRequest;
			request_id: number;
			error: unknown;
			onError?: IconNamesErrorCallback;
	  }
	| {
			type: IconNamesActionType.ReceiveData;
			request_id: number;
			data: string[];
			onSuccess?: IconNamesSuccessCallback;
	  };

/**
 * Check if a value is of type IconNamesResponse
 */
const isIconNamesResponse = (value: any): value is IconNamesResponse => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	if (!value['icons'] || !Array.isArray(value['icons'])) {
		return false;
	}

	if (value['icons'].some((icon) => typeof icon !== 'string')) {
		return false;
	}

	return true;
};

/**
 * Fetch list of all icon names
 */
const fetchIconNames = async () => {
	// Fetch icon names
	const response = await apiFetch({
		path: '/windmill-blocks/v1/icons',
		method: 'GET',
	});

	// Ensure response is valid data type
	if (!isIconNamesResponse(response)) {
		throw new Error('Unknown response.');
	}

	return response.icons;
};

/**
 * Unique id number iterator
 */
function* getUniqueId(): Iterator<number, number> {
	let id = 0;
	while (true) {
		yield id++;
	}
}

/** Request id generator */
const idGenerator = getUniqueId();

/**
 * Icon names state reducer
 */
const iconNamesReducer = (
	state: IconNamesState,
	action: IconNamesAction
): IconNamesState => {
	switch (action.type) {
		case IconNamesActionType.StartRequest:
			return {
				...state,
				status: IconNamesStatus.Loading,
				request_id: action.request_id,
			};

		case IconNamesActionType.FailRequest:
			// Ignore fails from stale requests
			if (action.request_id !== state.request_id) {
				console.log('stale error');
				return state;
			}

			action.onError?.(action.error);

			return {
				...state,
				status: IconNamesStatus.Error,
				error: action.error,
				data: [],
			};

		case IconNamesActionType.ReceiveData:
			// Ignore data from stale requests
			if (action.request_id !== state.request_id) {
				console.log('stale data');
				return state;
			}

			action.onSuccess?.(action.data);

			return {
				...state,
				status: IconNamesStatus.Loaded,
				error: undefined,
				data: action.data,
			};

		default:
			return state;
	}
};

/** Get all icon names */
export const useIconNames = (
	settings: {
		/** Fetch error callback */
		onError?: IconNamesErrorCallback;
		/** Fetch success callback */
		onSuccess?: IconNamesSuccessCallback;
		/** Auto fetch names on mount */
		fetch_on_mount?: boolean;
	} = {}
) => {
	const { onError, onSuccess, fetch_on_mount = true } = settings;

	const [names, dispatchNames] = useReducer(iconNamesReducer, {
		status: IconNamesStatus.Idle,
		data: [],
	});

	/**
	 * Dispatch a fetch request for icon names data
	 *
	 * @param force Force a fetch request even if one is already loading
	 */
	const getIconNames = async (force = false) => {
		if (!force && names.status === IconNamesStatus.Loading) {
			return;
		}

		// Start a new request
		const request_id = idGenerator.next().value;
		dispatchNames({
			type: IconNamesActionType.StartRequest,
			request_id,
		});

		try {
			// Fetch icon names data
			const data = await fetchIconNames();
			dispatchNames({
				type: IconNamesActionType.ReceiveData,
				data,
				request_id,
				onSuccess,
			});
		} catch (error) {
			// Receive error
			dispatchNames({
				type: IconNamesActionType.FailRequest,
				error,
				request_id,
				onError,
			});
		}
	};

	const data = useMemo(() => names.data, [names]);
	const error = useMemo(() => names.error, [names]);
	const isLoading = useMemo(
		() => names.status === IconNamesStatus.Loading,
		[names]
	);

	useEffect(() => {
		if (fetch_on_mount === false) {
			return;
		}

		getIconNames();
	}, []);

	return {
		data,
		isLoading,
		error,
		refetchNames: () => getIconNames(true),
	};
};
