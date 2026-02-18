import * as TypeDefs from '../typedefs';

import { useMemo, useState } from 'react';

/**
 * Wordpress dependencies
 */
import { Button } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * @typedef DeleteIconControlProps
 * @property {TypeDefs.IconData} [iconData]
 * @property {boolean} [disabled]
 * @property {(value: TypeDefs.IconData) => void} [onDelete]
 */

/**
 * Icon delete button control
 *
 * @param {DeleteIconControlProps} props
 * @returns {React.JSX.Element}
 */
export default function DeleteIconControl(props) {
	const { iconData, disabled, onDelete } = props;

	/**
	 * State
	 */
	const [isDeleting, setIsDeleting] = useState(false);

	/**
	 * Hooks
	 */
	const isDisabled = useMemo(
		() => disabled || isDeleting || iconData === undefined,
		[disabled, isDeleting, iconData]
	);

	/**
	 * Event handlers
	 */
	const onDeleteClick = async () => {
		if (iconData === undefined) {
			return;
		}

		try {
			setIsDeleting(true);

			// Get user confirmation before processing action
			if (
				!confirm(
					`Are you sure you want to delete ${iconData.filename}? This action can not be undone`
				)
			) {
				return;
			}

			// Ensure nonce value is set
			if (wpApiSettings?.nonce === undefined) {
				throw new Error('Invalid credentials.', {
					cause: 'wpApiSettings.nonce is undefined',
				});
			}

			// Register nonce authentication
			apiFetch.use(apiFetch.createNonceMiddleware(wpApiSettings.nonce));

			// Delete icon
			await apiFetch({
				path: `/windmill-blocks/v1/icons/${iconData.basename}`,
				method: 'DELETE',
			});

			onDelete?.(iconData);
		} catch (err) {
			console.error(err);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Button
			className="delete-icon-control"
			disabled={isDisabled}
			isBusy={isDeleting}
			isDestructive={true}
			variant="secondary"
			onClick={onDeleteClick}
			__next40pxDefaultSize
		>
			{iconData?.filename !== undefined
				? `Delete "${iconData.filename}"`
				: 'Delete icon'}
		</Button>
	);
}
