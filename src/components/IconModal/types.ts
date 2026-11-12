//
// Component types
//

export type IconModalComponent = (props: IconModalProps) => JSX.Element;
export type IconModalLibraryComponent = (
	props: IconModalLibraryProps
) => JSX.Element;
export type IconModalUploadComponent = (
	props: IconModalUploadProps
) => JSX.Element;

//
// Component prop types
//

export interface IconModalBaseProps {}

export interface IconModalProps extends IconModalBaseProps {
	/** Icon value */
	value?: string;

	/** On icon value change */
	onConfirm?: (value: string) => void;

	/** On modal request close */
	onClose: (
		event?:
			| React.KeyboardEvent<HTMLDivElement>
			| React.SyntheticEvent<Element, Event>
	) => void;

	/** On icons uploaded to library */
	onIconsUploaded?: (names: string[]) => void;
}

export interface IconModalUploadProps extends IconModalBaseProps {
	/** Allow multiple files to be uploaded */
	multiple?: boolean;

	/** On icons uploaded to library */
	onIconsUploaded?: (names: string[]) => void;
}

export interface IconModalLibraryProps extends IconModalBaseProps {
	/** Name of selected icon in icon library */
	selected?: string | null;

	/** On selected icon change */
	onSelectedChange?: (name: string | null) => void;

	/** On icon value change */
	onConfirm?: (value: string) => void;
}
