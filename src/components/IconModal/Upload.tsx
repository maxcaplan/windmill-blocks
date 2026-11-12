import {
	Panel,
	PanelBody,
	PanelRow,
	FormFileUpload,
	Button,
	DropZone,
} from '@wordpress/components';
import { Stack, Text, Progress } from '@wordpress/ui';
import { upload } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { useUploadIcons } from '@/hooks';

import { IconModalUploadComponent } from './types';

export const IconModalUpload: IconModalUploadComponent = ({
	onIconsUploaded,
}) => {
	const { uploadIcons, uploadCount, doneCount, isUploading } = useUploadIcons(
		{
			onUploaded: onIconsUploaded,
		}
	);

	return (
		<Panel className="wm-blocks-icon-modal__upload">
			<PanelBody className="wm-blocks-icon-modal__upload__body">
				{!isUploading && (
					<>
						<PanelRow className="wm-blocks-icon-modal__upload__dialog">
							<Stack
								direction="column"
								justify="center"
								align="center"
								gap="sm"
							>
								<Text variant="heading-xl" render={<h2 />}>
									{__('Drop files to upload')}
								</Text>

								<Text variant="body-sm">{__('or')}</Text>

								<FormFileUpload
									onChange={(event) =>
										uploadIcons(event.currentTarget.files)
									}
									multiple={true}
									accept="image/svg+xml"
									render={({ openFileDialog }) => (
										<Button
											variant="secondary"
											icon={upload}
											onClick={() => openFileDialog()}
											__next40pxDefaultSize
										>
											{__('Select Files')}
										</Button>
									)}
								/>
							</Stack>
						</PanelRow>

						<DropZone
							onFilesDrop={(files) => uploadIcons(files)}
							isEligible={(data) =>
								data.types.every(
									(data_type) => data_type === 'image/svg+xml'
								)
							}
						/>
					</>
				)}
				{isUploading && (
					<Progress.Root
						value={doneCount}
						max={uploadCount}
						format={{ style: 'decimal' }}
						getAriaValueText={(formatted_value) =>
							`${formatted_value} of ${uploadCount} icons uploaded`
						}
					>
						<Progress.Label>Uploading icons</Progress.Label>

						<Progress.Track>
							<Progress.Indicator />
						</Progress.Track>

						<Progress.Value>
							{(formatted_value) =>
								formatted_value === null
									? 'Preparing upload'
									: `${formatted_value} of ${uploadCount} icons uploaded`
							}
						</Progress.Value>
					</Progress.Root>
				)}
			</PanelBody>
		</Panel>
	);
};
