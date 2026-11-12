import { useState } from 'react';

import { Button, Modal } from '@wordpress/components';
import { Notice, Stack, Text } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { iconStore } from '@/stores';
import { parseFilenameLabel } from '@/util/text';
import { parseErrorMessage } from '@/util/error';

import { IconPickerDeleteModalComponent } from './types';

export const IconPickerDeleteModal: IconPickerDeleteModalComponent = ({
	selected,
	onCancel,
	onDeleted,
}) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { deleteIcon } = useDispatch(iconStore);

	/**
	 * Delete button click callback
	 */
	const onDeleteClick = async () => {
		if (isDeleting) {
			return;
		}

		setIsDeleting(true);

		try {
			const deleted = await deleteIcon(selected);
			onRequestClose(deleted);
		} catch (e) {
			setErrorMessage(parseErrorMessage(e));
		} finally {
			setIsDeleting(false);
		}
	};

	/**
	 * Modal request close callback
	 */
	const onRequestClose = (deleted?: string) => {
		// If a value was deleted, call deleted callback
		if (!!deleted) {
			onDeleted?.(deleted);
			return;
		}

		// If no value was or currently is being deleted, call cancel callback
		if (!isDeleting) {
			onCancel?.();
			return;
		}
	};

	return (
		<Modal
			title={__('Delete icon', 'windmill-data')}
			onRequestClose={() => onRequestClose()}
			isDismissible={false}
			shouldCloseOnClickOutside={!isDeleting}
			shouldCloseOnEsc={!isDeleting}
			focusOnMount={'firstElement'}
			size="medium"
		>
			<Stack direction="column" gap="md">
				{!!errorMessage && (
					<Notice.Root intent="error">
						<Notice.Title>
							{__('Failed to delete icon', 'windmill-data')}
						</Notice.Title>

						<Notice.Description>{errorMessage}</Notice.Description>
					</Notice.Root>
				)}
				<Text>
					Are you sure you want to delete{' '}
					<b>{parseFilenameLabel(selected)}</b>
					<br />
					This action cannot be undone
				</Text>

				<Stack direction="row" gap="sm" justify="end" align="center">
					<Button
						onClick={() => onRequestClose()}
						disabled={isDeleting}
					>
						{__('Cancel')}
					</Button>
					<Button
						variant="primary"
						isDestructive={true}
						onClick={onDeleteClick}
						disabled={isDeleting}
						isBusy={isDeleting}
					>
						{__('Delete')}
					</Button>
				</Stack>
			</Stack>
		</Modal>
	);
};
