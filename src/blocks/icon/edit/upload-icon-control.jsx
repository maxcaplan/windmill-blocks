import * as TypeDefs from '../typedefs';

import React, { useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import { FILE_UPLOAD_SIZE_LIMIT } from './constants';
import { parseErrorMessage } from '@/util/error';

/**
 * Wordpress dependencies
 */
import { Button, FormFileUpload } from '@wordpress/components';
import { uploadIcon } from './utils';

/**
 * @typedef UploadIconControlProps
 * @property {(value: TypeDefs.IconData) => void} [onChange]
 */

/**
 * Icon upload form control
 *
 * @param {UploadIconControlProps} props
 * @returns {React.JSX.Element}
 */
export default function UploadIconControl(props) {
	const { onChange: onChange } = props;

	/**
	 * State
	 */

	const [selectedIconFiles, setSelectedIconFiles] = useState(
		/** @type {File[]} */ ([])
	);

	const [isIconUploading, setIsIconUploading] = useState(false);

	const [uploadError, setUploadError] = useState(
		/** @type {string|undefined} */ (undefined)
	);

	/**
	 * Hooks
	 */

	const isSubmitButtonDisabled = useMemo(
		() => selectedIconFiles.length <= 0 || isIconUploading,
		[selectedIconFiles, isIconUploading]
	);

	const isFileSelectDisabled = useMemo(
		() => isIconUploading,
		[isIconUploading]
	);

	const fileName = useMemo(() => {
		if (selectedIconFiles.length === 0) {
			return undefined;
		}

		if (selectedIconFiles.length === 1) {
			return selectedIconFiles[0].name;
		}

		return `${selectedIconFiles.length.toString()} files`;
	}, [selectedIconFiles]);

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
			event.currentTarget.files.length <= 0
		) {
			setSelectedIconFiles([]);
			return;
		}

		const files = Array.from(event.currentTarget.files).filter(
			(file) => file.type === 'image/svg+xml'
		);

		setSelectedIconFiles(files);
	};

	/**
	 * Upload form submit event handler
	 *
	 * @param {React.FormEvent<HTMLFormElement>} event
	 */
	const onUploadFormSubmit = async (event) => {
		event.preventDefault();

		setIsIconUploading(true);
		setUploadError(undefined);

		try {
			for (
				let file_idx = 0;
				file_idx < selectedIconFiles.length;
				file_idx++
			) {
				const result = await uploadIcon(
					'POST',
					FILE_UPLOAD_SIZE_LIMIT,
					selectedIconFiles[file_idx]
				);

				onChange?.(result);
			}
		} catch (err) {
			console.error('Upload error:', err);
			setUploadError(parseErrorMessage(err));
		} finally {
			setIsIconUploading(false);
			setSelectedIconFiles([]);
		}
	};

	return (
		<form className="upload-icon-control" onSubmit={onUploadFormSubmit}>
			<h3 className="upload-icon-control__header">Upload Icon</h3>

			<div className="upload-icon-control__inner">
				<FormFileUpload
					accept="image/svg+xml"
					multiple={true}
					onChange={onUploadChange}
					className="upload-icon-control__file-select"
					title={fileName}
					disabled={isFileSelectDisabled}
					__next40pxDefaultSize
				>
					{fileName ?? 'Select file'}
				</FormFileUpload>

				<Button
					className="upload-icon-control__submit"
					variant="secondary"
					type="submit"
					disabled={isSubmitButtonDisabled}
					isBusy={isIconUploading}
				>
					Submit
				</Button>
			</div>

			{uploadError !== undefined && (
				<p className="upload-icon-control__error">
					<b>Failed to upload icon:</b> {uploadError}
				</p>
			)}
		</form>
	);
}
