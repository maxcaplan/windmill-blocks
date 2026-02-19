import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

/** Frontend styles */
import './styles/style.scss';

/**
 * Register blocks
 */

// @ts-ignore
registerBlockType(metadata.name, {
	...metadata,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});

// @ts-ignore
registerBlockType('windmill-blocks/navbar-mobile-menu-toggle-button', {
	...metadata,
	name: 'windmill-blocks/navbar-mobile-menu-toggle-button',
	title: 'Navbar Mobile Menu Toggle',
	parent: ['windmill-blocks/navbar-mobile-menu-toggle'],
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});
