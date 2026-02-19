/**
 * Wordpress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

/** Frontend styles */
import './styles/style.scss';

const navbar_mobile_menu_toggle_button_metadata = {
	...metadata,
	name: 'windmill-blocks/navbar-mobile-menu-toggle-button',
	title: 'Navbar Mobile Menu Toggle',
	parent: ['windmill-blocks/navbar-mobile-menu-toggle'],
};

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
registerBlockType(navbar_mobile_menu_toggle_button_metadata, {
	...navbar_mobile_menu_toggle_button_metadata,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: (props) =>
		Save({
			...props,
			// Pass block name to save component
			name: 'windmill-blocks/navbar-mobile-menu-toggle-button',
		}),
});
