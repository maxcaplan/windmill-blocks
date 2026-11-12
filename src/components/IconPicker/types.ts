import { SidebarTab } from './constants';

export interface IconPickerDataItem {
	id: string;
	label: string;
}

//
// Component types
//

export type IconPickerComponent = (props: IconPickerProps) => React.JSX.Element;
export type IconPickerSidebarComponent = (
	props: IconPickerSidebarProps
) => React.JSX.Element;
export type IconPickerDeleteModalComponent = (
	props: IconPickerDeleteModalProps
) => React.JSX.Element;
export type IconPickerReplaceModalComponent = (
	props: IconPickerReplaceModalProps
) => React.JSX.Element;

//
// Component prop types
//

export interface IconPickerProps extends React.HTMLAttributes<HTMLDivElement> {
	/** When set, controls which icon is selected */
	selected?: string | null;

	/** On selected icon change */
	onSelectedChange?: (icon: string | null) => void;

	/** On selection confirmed */
	onConfirm?: (selected: string) => void;

	/** On selection cancelled */
	onCancel?: () => void;
}

export interface IconPickerSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
	/** When set, controls which sidebar tab is active */
	activeTab?: SidebarTab;

	/** On sidebar active tab change */
	onActiveTabChange?: (tab: SidebarTab) => void;

	/** Name of the selected icon to display in the sidebar */
	selected?: string;

	/** Icon deleted callback */
	onDeleted?: (name: string) => void;
}

export interface IconPickerDeleteModalProps {
	/** Selected icon to delete */
	selected: string;

	/** Delete cancelled callback */
	onCancel?: () => void;

	/** Icon deleted callback */
	onDeleted?: (name: string) => void;
}

export interface IconPickerReplaceModalProps {
	/** Selected icon to delete */
	selected: string;

	/** Delete cancelled callback */
	onCancel?: () => void;

	/** Confirm replace callback */
	onConfirm?: (name: string) => void;
}
