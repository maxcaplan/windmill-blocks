import { JSX, ReactNode } from 'react';

//
// Component types
//

export type IconControlComponent = (
	props: IconControlProps & Omit<IconControlToggleButtonProps, 'children'>
) => JSX.Element;

export type IconControlLabelComponent = (
	props: IconControlLabelProps & React.ComponentPropsWithRef<'div'>
) => JSX.Element;

export type IconControlToggleComponent = (
	props: IconControlToggleProps & IconControlToggleButtonProps
) => JSX.Element;

export type IconControlContentComponent = (
	props: IconControlContentProps
) => JSX.Element;

//
// Component prop types
//

interface IconControlBaseProps {
	value?: string;
}

interface IconControlInnerProps extends IconControlBaseProps {
	/** Toggle is open */
	isOpen: boolean;

	/** Toggle control open */
	onToggle: () => void;

	/** Close control */
	onClose: () => void;
}

export interface IconControlProps
	extends
		Omit<IconControlToggleProps, keyof IconControlInnerProps>,
		IconControlBaseProps {
	/** On icons uploaded to library */
	onIconsUploaded?: (names: string[]) => void;

	/** Icon selected */
	onChange?: (value?: string) => void;

	/** If provided, renders a tooltip for the component */
	tooltip?: string;

	/** Control has a file dropzone */
	withDropzone?: boolean;

	/** Control has a reset button */
	withResetButton?: boolean;
}

export interface IconControlToggleProps
	extends IconControlLabelProps, IconControlInnerProps {
	/** Control toggle render callback */
	renderToggle?: IconControlRenderToggleCallback;
}

type IconControlToggleButtonProps = Omit<
	React.ComponentPropsWithRef<'button'>,
	'onChange'
>;

export interface IconControlLabelProps extends Omit<
	IconControlInnerProps,
	'onToggle' | 'onClose'
> {
	/** Control toggle label */
	renderLabel?: IconControlRenderLabelCallback | string;
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

export type IconControlRenderLabelCallback = (
	props: React.ComponentPropsWithRef<'div'>,
	state: Omit<IconControlLabelProps, 'renderLabel'>
) => ReactNode;

export type IconControlRenderToggleCallback = (
	props: IconControlToggleButtonProps,
	state: React.PropsWithChildren<
		Omit<IconControlToggleProps, 'renderToggle' | 'renderLabel'>
	>
) => ReactNode;
