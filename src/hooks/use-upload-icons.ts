import { useMemo, useState } from 'react';

import { useDispatch, useSelect } from '@wordpress/data';

import { iconStore } from '@/stores';
import { ICON_STATUS } from '@/stores/icons';

interface UseIconUploadArgs {
	onUploaded?: (loaded: string[]) => void;
	clear_delay?: number;
}

/**
 * Upload one or more icon files and keep track of uploading statuses
 */
export const useUploadIcons = ({
	onUploaded,
	clear_delay = 1000,
}: UseIconUploadArgs = {}) => {
	const [uploadingIconNames, setUploadingIconNames] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const { uploadIcons } = useDispatch(iconStore);

	/** Status of icons being uploaded */
	const iconStatuses = useSelect(
		(select) =>
			uploadingIconNames.map((name) => ({
				name,
				status: select(iconStore).getIconStatus(name),
			})),
		[uploadingIconNames]
	);

	/** Uploading icons with status of loaded or error */
	const doneIcons = useMemo(
		() =>
			iconStatuses.filter(
				(icon) =>
					icon.status === ICON_STATUS.LOADED ||
					icon.status === ICON_STATUS.ERROR
			),
		[iconStatuses]
	);

	const uploadCount = useMemo(
		() => uploadingIconNames.length,
		[uploadingIconNames]
	);
	const doneCount = useMemo(() => doneIcons.length, [doneIcons]);

	/**
	 * File upload event handler
	 */
	const onFilesUpload = async (files?: File | File[] | FileList | null) => {
		if (isUploading || !files) {
			return;
		}

		setIsUploading(true);

		const { names, data: response } = await uploadIcons(
			files instanceof FileList ? Array.from(files) : files
		);

		setUploadingIconNames((current) => [...current, ...names]);

		const data = await response;

		setTimeout(() => {
			setIsUploading(false);
			setUploadingIconNames([]);
			onUploaded?.(data.map((data) => data.name));
		}, clear_delay);
	};

	return {
		uploadIcons: onFilesUpload,
		iconStatuses,
		doneIcons,
		uploadCount,
		doneCount,
		isUploading,
	};
};
