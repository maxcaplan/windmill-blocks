import { useState } from 'react';

import { Button, Modal, FormFileUpload } from '@wordpress/components';
import { Notice, Stack, Text } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { iconStore } from '@/stores';
import { parseFilenameLabel } from '@/util/text';

import { IconPickerReplaceModalComponent } from './types';

export const IconPickerReplaceModal: IconPickerReplaceModalComponent = ({
	selected,
	onCancel,
	onConfirm,
}) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { replaceIcon } = useDispatch(iconStore);

	/**
	 * Modal request close callback
	 */
	const onRequestClose = (cancelled = true) => {
		if (cancelled) {
			onCancel?.();
		} else {
			onConfirm?.(selected);
		}
	};

	/**
	 * File upload callback
	 */
	const onFilesUpload = (files: File[]) => {
		const file = files.at(-1);

		if (file === undefined) {
			return;
		}

		if (file.type !== 'image/svg+xml') {
			setErrorMessage('File must be of type image/svg+xml.');
			return;
		}

		replaceIcon(selected, file);
		onRequestClose(false);
	};

	return (
		<Modal
			title={__('Replace icon', 'windmill-data')}
			onRequestClose={() => onRequestClose()}
			isDismissible={false}
			focusOnMount={'firstElement'}
			size="medium"
		>
			<Stack direction="column" gap="md">
				{!!errorMessage && (
					<Notice.Root intent="error">
						<Notice.Title>
							{__('Failed to replace icon', 'windmill-data')}
						</Notice.Title>

						<Notice.Description>{errorMessage}</Notice.Description>
					</Notice.Root>
				)}
				<Text>
					Are you sure you want to replace{' '}
					<b>{parseFilenameLabel(selected)}</b>
					<br />
					This action cannot be undone
				</Text>

				<Stack direction="row" gap="sm" justify="end" align="center">
					<Button onClick={() => onRequestClose()}>
						{__('Cancel')}
					</Button>

					<FormFileUpload
						onChange={(event) =>
							onFilesUpload?.(
								Array.from(event.target.files ?? [])
							)
						}
						multiple={false}
						accept="image/svg+xml"
						render={({ openFileDialog }) => (
							<Button
								variant="primary"
								isDestructive={true}
								onClick={() => openFileDialog()}
							>
								{__('Replace')}
							</Button>
						)}
					/>
				</Stack>
			</Stack>
		</Modal>
	);
};
