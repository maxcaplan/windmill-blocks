import { useState } from 'react';

import { Modal } from '@wordpress/components';
import { Tabs } from '@wordpress/ui';
import { __ } from '@wordpress/i18n';
import { SnackbarNotices } from '@wordpress/notices';

import { context as iconsContext } from '@/stores/icons';

import { IconModalLibrary } from './Library';
import { IconModalUpload } from './Upload';
import { IconModalComponent } from './types';

import './styles.scss';
import { IconModalTab } from './constants';

/**
 * Icon library and upload modal
 */
export const IconModal: IconModalComponent = ({
	value,
	onConfirm,
	onClose,
	onIconsUploaded,
}) => {
	const [tabValue, setTabValue] = useState<IconModalTab>(
		IconModalTab.Library
	);
	const [selectedIcon, setSelectedIcon] = useState<string | null>(
		value ?? null
	);

	return (
		<Modal
			className="wm-blocks-icon-modal"
			title={__('Select or Upload Icon', 'windmill-blocks')}
			onRequestClose={onClose}
			isFullScreen
		>
			<div className="wm-blocks-icon-modal__body">
				<Tabs.Root
					className="wm-blocks-icon-modal__root"
					value={tabValue}
					onValueChange={(value) => setTabValue(value)}
				>
					<Tabs.List className="wm-blocks-icon-modal__tablist">
						<Tabs.Tab value={IconModalTab.Upload}>
							{__('Upload icons', 'windmill-blocks')}
						</Tabs.Tab>
						<Tabs.Tab value={IconModalTab.Library}>
							{__('Icon library', 'windmill-blocks')}
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel
						value={IconModalTab.Upload}
						className="wm-blocks-icon-modal__tabpanel"
					>
						<IconModalUpload
							onIconsUploaded={(names) => {
								onIconsUploaded?.(names);

								// Set selected icon to last uploaded and switch tab
								setSelectedIcon(names.at(-1) ?? null);
								setTabValue(IconModalTab.Library);
							}}
						/>
					</Tabs.Panel>

					<Tabs.Panel
						value={IconModalTab.Library}
						className="wm-blocks-icon-modal__tabpanel"
					>
						<IconModalLibrary
							selected={selectedIcon}
							onSelectedChange={setSelectedIcon}
							onConfirm={onConfirm}
						/>
					</Tabs.Panel>
				</Tabs.Root>

				<SnackbarNotices
					className="wm-blocks-icon-modal__notices--snackbar"
					context={iconsContext}
				/>
			</div>
		</Modal>
	);
};
