import { BlockMetadata } from '@/util/blocks';
import { BlockEditProps } from '@wordpress/blocks';

export type IconBlockBindableAttributes =
	| 'icon'
	| 'flipHorizontal'
	| 'flipVertical'
	| 'rotation'
	| 'strokeWidth'
	| 'nonScalingStroke'
	| 'ariaLabel';

export interface IconBlockAttributes extends Record<string, unknown> {
	icon?: string;
	flipHorizontal: boolean;
	flipVertical: boolean;
	rotation: number;
	strokeWidth?: string;
	nonScalingStroke: boolean;
	ariaLabel?: string;
	metadata?: BlockMetadata<IconBlockBindableAttributes>;
}

//
// Component types
//

export type IconBlockEditComponent = React.ComponentType<IconBlockEditProps>;

//
// Component props types
//

export type IconBlockEditProps = BlockEditProps<IconBlockAttributes>;
