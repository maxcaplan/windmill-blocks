/**
 * Wordpress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { navigation as blockIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

/** Frontend styles */
import './styles/style.scss';

/**
 * Register block
 */

/** @ts-ignore */
registerBlockType(metadata, {
	...metadata,
	icon: blockIcon,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});
