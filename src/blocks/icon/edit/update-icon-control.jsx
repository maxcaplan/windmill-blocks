import * as TypeDefs from '../typedefs';

import { useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import { FILE_UPLOAD_SIZE_LIMIT } from './constants';
import { uploadIcon } from './utils';

/**
 * Wordpress dependencies
 */
import { FormFileUpload } from '@wordpress/components';

/**
 * @typedef UpdateIconControlProps
 * @property {TypeDefs.IconData} [iconData]
 * @property {boolean} [disabled]
 * @property {(value: TypeDefs.IconData) => void} [onUpdate]
 */

/**
 * Icon update button control
 *
 * @param {UpdateIconControlProps} props
 * @returns {React.JSX.Element}
 */
export default function UpdateIconControl(props) {
	const { iconData, disabled, onUpdate } = props;

	/**
	 * State
	 */
	const [isUpdating, setIsUpdating] = useState(false);

	const [selectedIconFile, setSelectedIconFile] = useState(
		/** @type {File|undefined} */ (undefined)
	);

	/**
	 * Functions
	 */
	const updateIcon = async () => {
		if (iconData === undefined || selectedIconFile === undefined) {
			return;
		}

		try {
			setIsUpdating(true);

			// Get user confirmation before processing action
			if (
				!confirm(
					`Are you sure you want to update ${iconData.filename}? This action can not be undone`
				)
			) {
				return;
			}

			const result = await uploadIcon(
				'POST',
				FILE_UPLOAD_SIZE_LIMIT,
				selectedIconFile,
				iconData.basename
			);

			onUpdate?.(result);
		} catch (err) {
			console.error(err);
		} finally {
			setIsUpdating(false);
		}
	};

	/**
	 * Hooks
	 */
	const isDisabled = useMemo(
		() => disabled || isUpdating || iconData === undefined,
		[disabled, isUpdating, iconData]
	);

	// Update icon when file selected
	useEffect(() => {
		if (!isUpdating) {
			updateIcon();
		}
	}, [selectedIconFile]);

	/**
	 * Event Handlers
	 */

	/**
	 * Icon upload input vale change event handler
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} event
	 */
	const onUploadChange = (event) => {
		if (
			event.currentTarget.files === null ||
			event.currentTarget.files?.length === undefined ||
			event.currentTarget.files.length <= 0 ||
			event.currentTarget.files[0].type !== 'image/svg+xml'
		) {
			setSelectedIconFile(undefined);
			return;
		}

		setSelectedIconFile(event.currentTarget.files[0]);
	};

	return (
		<FormFileUpload
			accept="image/svg+xml"
			onChange={onUploadChange}
			className="update-icon-control is-secondary"
			disabled={isDisabled}
			__next40pxDefaultSize
		>
			{iconData?.filename !== undefined
				? `Replace "${iconData.filename}"`
				: 'Replace icon'}
		</FormFileUpload>
	);
}
