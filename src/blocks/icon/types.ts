import { BlockEditProps } from '@wordpress/blocks';

export interface IconBlockAttributes extends Record<string, unknown> {
	icon?: string;
	flipHorizontal: boolean;
	flipVertical: boolean;
	rotation: number;
	ariaLabel?: string;
	strokeWidth?: string;
	nonScalingStroke: boolean;
}

//
// Component types
//

export type IconBlockEditComponent = React.ComponentType<IconBlockEditProps>;

//
// Component props types
//

export type IconBlockEditProps = BlockEditProps<IconBlockAttributes>;
