import { useState } from 'react';

import {
	Button,
	Dropdown,
	FlexBlock,
	NavigableMenu,
	MenuItem,
	FormFileUpload,
	DropZone,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';
import { Stack, Spinner } from '@wordpress/ui';
import {
	upload as uploadIcon,
	category as libraryIcon,
	reset as resetIcon,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { useUploadIcons } from '@/hooks';
import { IconModal, Icon, PlaceholderGraphic } from '@/components';
import { parseFilenameLabel } from '@/util/text';

import {
	IconControlComponent,
	IconControlToggleComponent,
	IconControlContentComponent,
	IconControlLabelComponent,
} from './types';

import './styles.scss';

/** Icon control dropdown toggle label */
const IconControlLabel: IconControlLabelComponent = ({ label, ...props }) => {
	const { value } = props;

	// Render provided label
	if (label !== undefined) {
		return <>{typeof label === 'function' ? label(props) : label}</>;
	}

	// Render default label
	return (
		<Stack direction="row" gap="sm" align="center" wrap="nowrap">
			<span className="wm-blocks-icon-control-component__icon-indicator">
				<Icon
					icon={value}
					renderLoading={(props) => <Spinner {...props} />}
					renderPlaceholder={(props) => (
						<PlaceholderGraphic {...props} fill="none" />
					)}
				/>
			</span>

			<FlexBlock>
				<Truncate numberOfLines={1}>
					{!!value
						? parseFilenameLabel(value)
						: __('Add icon', 'windmill-blocks')}
				</Truncate>
			</FlexBlock>
		</Stack>
	);
};

/** Icon control dropdown toggle */
const IconControlToggle: IconControlToggleComponent = ({
	renderToggle,
	...props
}) => {
	const { isOpen, onToggle } = props;

	if (renderToggle !== undefined) {
		return (
			<>
				{renderToggle({
					...props,
					'aria-haspopup': 'true',
					'aria-expanded': isOpen,
					children: <IconControlLabel {...props} />,
				})}
			</>
		);
	}

	return (
		<Button
			aria-haspopup="true"
			aria-expanded={isOpen}
			onClick={() => onToggle()}
			__next40pxDefaultSize
		>
			<IconControlLabel {...props} />
		</Button>
	);
};

/** Icon control dropdown content */
const IconControlContent: IconControlContentComponent = ({
	value,
	onChange,
	onClose,
	onFilesUpload,
	onOpenModal,
	isUploading = false,
}) => {
	return (
		<NavigableMenu>
			<MenuItem
				icon={libraryIcon}
				onClick={() => {
					onClose();
					onOpenModal();
				}}
			>
				{__('Open Icon Library', 'windmill-blocks')}
			</MenuItem>

			<FormFileUpload
				onChange={(event) =>
					onFilesUpload?.(Array.from(event.target.files ?? []))
				}
				multiple={false}
				accept="image/svg+xml"
				render={({ openFileDialog }) => (
					<MenuItem
						icon={isUploading ? <Spinner /> : uploadIcon}
						disabled={isUploading}
						onClick={() => openFileDialog()}
					>
						{isUploading ? __('Uploading') : __('Upload')}
					</MenuItem>
				)}
			/>

			{!!value && (
				<MenuItem
					onClick={() => {
						onChange?.(undefined);
						onClose();
					}}
				>
					{__('Reset')}
				</MenuItem>
			)}
		</NavigableMenu>
	);
};

/** Complete icon selection control */
export const IconControl: IconControlComponent = ({
	value,
	dropzone = true,
	resetButton = true,
	onChange,
	onIconsUploaded,
	label,
	renderToggle,
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isIconModalOpen, setIsIconModalOpen] = useState(false);

	const { uploadIcons, isUploading } = useUploadIcons({
		onUploaded: (names) => {
			onIconsUploaded?.(names);

			const last_uploaded = names.at(-1);

			if (!!last_uploaded) {
				onChange?.(last_uploaded);
				setIsDropdownOpen(false);
			}
		},
		clear_delay: 500,
	});

	return (
		<>
			<div className="wm-blocks-icon-control-component">
				<Dropdown
					className="wm-blocks-icon-control-component__dropdown"
					contentClassName="wm-blocks-icon-control-component__options"
					open={isDropdownOpen}
					onToggle={setIsDropdownOpen}
					renderToggle={(callbackProps) => (
						<IconControlToggle
							{...callbackProps}
							value={value}
							label={label}
							renderToggle={renderToggle}
						/>
					)}
					renderContent={(callbackProps) => (
						<IconControlContent
							{...callbackProps}
							value={value}
							isUploading={isUploading}
							onChange={onChange}
							onFilesUpload={(files) => uploadIcons(files)}
							onOpenModal={() => setIsIconModalOpen(true)}
						/>
					)}
				/>

				{!!resetButton && !!value && (
					<Button
						className="wm-blocks-icon-control-component__reset-button"
						icon={resetIcon}
						label={__('Reset')}
						size="small"
						onClick={() => onChange?.(undefined)}
					/>
				)}

				{dropzone && !isUploading && (
					<DropZone
						onFilesDrop={(files) => uploadIcons(files)}
						isEligible={(data) =>
							data.types.every(
								(data_type) => data_type === 'image/svg+xml'
							)
						}
					/>
				)}
			</div>

			{isIconModalOpen && (
				<IconModal
					value={value}
					onConfirm={(value) => {
						setIsIconModalOpen(false);
						setIsDropdownOpen(false);
						onChange?.(value);
					}}
					onClose={() => setIsIconModalOpen(false)}
					onIconsUploaded={onIconsUploaded}
				/>
			)}
		</>
	);
};
