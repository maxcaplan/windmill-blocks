//
// Component types
//

import { JSX, ReactNode } from 'react';

export type IconControlComponent = (props: IconControlProps) => JSX.Element;

export type IconControlLabelComponent = (
	props: IconControlLabelProps
) => JSX.Element;

export type IconControlToggleComponent = (
	props: IconControlToggleProps
) => JSX.Element;

export type IconControlContentComponent = (
	props: IconControlContentProps
) => JSX.Element;

//
// Component prop types
//

interface IconControlBaseProps {
	value?: string;

	/** Allow uploading multiple files at once */
	multiple?: boolean;
}

interface IconControlInnerProps extends IconControlBaseProps {
	/** Toggle is open */
	isOpen: boolean;

	/** Toggle control open */
	onToggle: () => void;

	/** Close control */
	onClose: () => void;
}

export interface IconControlProps extends IconControlBaseProps {
	/** On icons uploaded to library */
	onIconsUploaded?: (names: string[]) => void;

	/** Icon selected */
	onChange?: (value?: string) => void;

	/** Control has a file dropzone */
	dropzone?: boolean;

	/** Control has a reset button */
	resetButton?: boolean;

	/** Control toggle label */
	label?: IconControlLabelCallback | string;

	/** Control toggle render callback */
	renderToggle?: IconControlRenderToggleCallback;
}

export interface IconControlToggleProps extends IconControlInnerProps {
	/** Control toggle label */
	label?: IconControlLabelCallback | string;

	/** Control toggle render callback */
	renderToggle?: IconControlRenderToggleCallback;

	'aria-haspopup'?: string;
	'aria-expanded'?: boolean;
}

export interface IconControlLabelProps extends Omit<
	IconControlInnerProps,
	'onToggle' | 'onClose'
> {
	/** Control toggle label */
	label?: IconControlLabelCallback | string;
}

export interface IconControlContentProps extends IconControlInnerProps {
	/** Icon selected */
	onChange?: (value?: string) => void;

	/** Open icon library modal */
	onOpenModal: () => void;

	/** Files uploaded from client */
	onFilesUpload?: (files: File[]) => void;

	isUploading?: boolean;
}

//
// Callback types
//

export type IconControlLabelCallback = (
	props: Omit<IconControlLabelProps, 'label'>
) => ReactNode;

export type IconControlRenderToggleCallback = (
	props: React.PropsWithChildren<Omit<IconControlToggleProps, 'renderToggle'>>
) => ReactNode;
