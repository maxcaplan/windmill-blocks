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
import { Stack, Spinner, Tooltip } from '@wordpress/ui';
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

/** Icon control dropdown toggle label */
const IconControlLabel: IconControlLabelComponent = ({
	renderLabel,
	isOpen,
	value,
	...props
}) => {
	// Render provided label
	if (renderLabel !== undefined) {
		return (
			<>
				{typeof renderLabel === 'function'
					? renderLabel(props, { isOpen, value })
					: renderLabel}
			</>
		);
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
	value,
	isOpen,
	onToggle,
	onClose,
	renderLabel,
	renderToggle,
	...props
}) => {
	const control_label = (
		<IconControlLabel
			renderLabel={renderLabel}
			value={value}
			isOpen={isOpen}
		/>
	);

	if (renderToggle !== undefined) {
		return (
			<>
				{renderToggle(
					{
						...props,
						onClick: () => onToggle(),
						'aria-haspopup': 'true',
						'aria-expanded': isOpen,
						children: control_label,
					},
					{
						value,
						isOpen,
						onToggle,
						onClose,
					}
				)}
			</>
		);
	}

	return (
		<Button
			{...props}
			aria-haspopup="true"
			aria-expanded={isOpen}
			onClick={() => onToggle()}
			__next40pxDefaultSize
		>
			{control_label}
		</Button>
	);
};

/** Complete icon selection control */
export const IconControl: IconControlComponent = ({
	value,
	withDropzone = false,
	withResetButton = false,
	onChange,
	onIconsUploaded,
	tooltip,
	...toggle_props
}) => {
	const { disabled } = toggle_props;
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
			<Tooltip.Root disabled={!tooltip}>
				<Tooltip.Trigger
					aria-label={tooltip}
					render={
						<div className="wm-blocks-icon-control-component" />
					}
				>
					<Dropdown
						className="wm-blocks-icon-control-component__dropdown"
						contentClassName="wm-blocks-icon-control-component__options"
						open={isDropdownOpen}
						onToggle={setIsDropdownOpen}
						disabled={disabled}
						renderToggle={(callbackProps) => (
							<IconControlToggle
								{...callbackProps}
								{...toggle_props}
								value={value}
							/>
						)}
						renderContent={(callbackProps) => (
							<IconControlContent
								{...callbackProps}
								value={value}
								isUploading={isUploading}
								onChange={onChange}
								onFilesUpload={(files) =>
									!disabled && uploadIcons(files)
								}
								onOpenModal={() => setIsIconModalOpen(true)}
							/>
						)}
					/>

					{!disabled && (
						<>
							{!!withResetButton && !!value && (
								<Button
									className="wm-blocks-icon-control-component__reset-button"
									icon={resetIcon}
									label={__('Reset')}
									size="small"
									onClick={() => onChange?.(undefined)}
								/>
							)}

							{!!withDropzone && !isUploading && (
								<DropZone
									onFilesDrop={(files) => uploadIcons(files)}
									isEligible={(data) =>
										data.types.every(
											(data_type) =>
												data_type === 'image/svg+xml'
										)
									}
								/>
							)}
						</>
					)}
				</Tooltip.Trigger>

				<Tooltip.Popup>{tooltip}</Tooltip.Popup>
			</Tooltip.Root>

			{!disabled && isIconModalOpen && (
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
