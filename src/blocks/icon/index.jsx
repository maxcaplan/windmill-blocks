import { registerBlockType } from '@wordpress/blocks';
import { starFilled as blockIcon } from '@wordpress/icons';

/** Frontend styles */
import './styles/style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

/**
 * Register block
 */
/** @ts-ignore */
registerBlockType(metadata.name, {
	...metadata,
	icon: blockIcon,
	/** Editor component */
	edit: Edit,
});
