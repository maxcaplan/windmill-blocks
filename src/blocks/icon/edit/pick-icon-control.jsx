import * as TypeDefs from '../typedefs';

import React, { useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import { isIconDataArray } from '@/components/InlineIcon/util';
import { parseErrorMessage } from '@/util/error';

/**
 * Wordpress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import PickIconControlButton from './pick-icon-control-button';
import DeleteIconControl from './delete-icon-control';
import UpdateIconControl from './update-icon-control';

/**
 * Fetch icon data from REST API
 *
 * @returns {[TypeDefs.IconData[], React.Dispatch<React.SetStateAction<TypeDefs.IconData[]>>, boolean, string|undefined]}
 */
const useGetIcons = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [loadedData, setLoadedData] = useState(
		/** @type {TypeDefs.IconData[]} */ ([])
	);
	const [errorMessage, setErrorMessage] = useState(
		/** @type {undefined|string} */ (undefined)
	);

	/**
	 * @param {AbortController} [controller]
	 */
	const fetchIconData = async (controller) => {
		try {
			setIsLoading(true);
			setErrorMessage(undefined);

			// Ensure nonce value is set
			if (wpApiSettings?.nonce === undefined) {
				throw new Error('Invalid credentials.', {
					cause: 'wpApiSettings.nonce is undefined',
				});
			}

			// Register nonce authentication
			apiFetch.use(apiFetch.createNonceMiddleware(wpApiSettings.nonce));

			// Fetch icon data
			const results = await apiFetch({
				path: '/windmill-blocks/v1/icons',
				method: 'GET',
				signal: controller?.signal,
			});

			if (
				results === undefined ||
				results === null ||
				typeof results !== 'object' ||
				!isIconDataArray(results['files'])
			) {
				throw new Error('Unknown response.');
			}

			setLoadedData(results['files']);
		} catch (err) {
			console.error(err);
			setErrorMessage(parseErrorMessage(err));
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch icon data on component mounted
	useEffect(() => {
		fetchIconData();
	}, []);

	return [loadedData, setLoadedData, isLoading, errorMessage];
};

/**
 * @typedef PickIconControlProps
 * @property {TypeDefs.IconData[]} [iconData]
 * @property {string} [value]
 * @property {(value?: TypeDefs.IconData) => void} [onChange]
 * @property {(value: TypeDefs.IconData) => void} [onUpdate]
 */

/**
 * Icon grid picker control
 *
 * @param {PickIconControlProps} props
 * @returns {React.JSX.Element}
 */
export default function PickIconControl(props) {
	const { iconData: uploadedIconData, value, onChange, onUpdate } = props;

	/**
	 * State
	 */

	const [updatedIconData, setUpdateIconData] = useState(
		/** @type {TypeDefs.IconData|undefined} */ (undefined)
	);

	/**
	 * Hooks
	 */

	const [loadedIconData, setLoadedIconData, isLoading, loadErrorMessage] =
		useGetIcons();

	/** Alpha sorted icon data by basename */
	const iconData = useMemo(
		() =>
			loadedIconData
				.concat(uploadedIconData || [])
				.sort((a, b) => (a.basename >= b.basename ? 1 : -1)),
		[uploadedIconData, loadedIconData]
	);

	const selectedIconData = useMemo(
		() => iconData.find((data) => data.filename === value),
		[iconData, value]
	);

	/**
	 * Event Handlers
	 */

	/**
	 * Icon update event handler
	 *
	 * @param {TypeDefs.IconData} icon_data
	 */
	const onIconUpdate = (icon_data) => {
		if (
			iconData.find((data) => data.filename === icon_data.filename) !==
			undefined
		) {
			setUpdateIconData(icon_data);
		} else {
			setLoadedIconData(loadedIconData.concat([icon_data]));
		}

		if (value === icon_data.filename) {
			onUpdate?.(icon_data);
		}
	};

	/**
	 * Icon delete event handler
	 *
	 * @param {TypeDefs.IconData} icon_data
	 */
	const onIconDelete = (icon_data) => {
		setLoadedIconData(loadedIconData.filter((data) => data !== icon_data));

		if (value === icon_data.filename) {
			onChange?.(undefined);
		}
	};

	return (
		<div className="pick-icon-control">
			<h3 className="pick-icon-control__header">Pick Icon</h3>

			<div className="pick-icon-control__inner">
				{!isLoading && (
					<div className="pick-icon-control__items">
						<PickIconControlButton.Default
							selected={value === undefined}
							onClick={onChange}
						/>

						{iconData.map((data) => (
							<PickIconControlButton
								key={data.filename}
								iconData={data}
								selected={value === data.filename}
								updatedData={updatedIconData}
								onClick={onChange}
							/>
						))}
					</div>
				)}

				{isLoading && (
					<div className="pick-icon-control__spinner-wrapper">
						<span className="pick-icon-control__spinner" />
					</div>
				)}

				{!isLoading && loadErrorMessage !== undefined && (
					<p className="pick-icon-control__error">
						<b>Failed to load icons:</b> {loadErrorMessage}
					</p>
				)}
			</div>

			<div className="pick-icon-control__footer">
				<UpdateIconControl
					iconData={selectedIconData}
					disabled={isLoading}
					onUpdate={onIconUpdate}
				/>

				<DeleteIconControl
					iconData={selectedIconData}
					disabled={isLoading}
					onDelete={onIconDelete}
				/>
			</div>
		</div>
	);
}
