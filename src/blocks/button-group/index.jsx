/**
 * Wordpress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	buttons as blockIcon,
	menu as navbarMobileMenuToggleIcon,
	page as megaMenuToggleIcon,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

/** Frontend styles */
import './styles/style.scss';

const navbar_mobile_menu_toggle_metadata = {
	...metadata,
	name: 'windmill-blocks/navbar-mobile-menu-toggle',
	title: 'Navbar Mobile Menu Toggle',
};

const mega_menu_toggle_metadata = {
	...metadata,
	name: 'windmill-blocks/mega-menu-toggle',
	title: 'Mega Menu Toggle',
};

/**
 * Register block
 */
/** @ts-ignore */
registerBlockType(metadata.name, {
	...metadata,
	icon: blockIcon,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});

/** @ts-ignore */
registerBlockType(navbar_mobile_menu_toggle_metadata, {
	...navbar_mobile_menu_toggle_metadata,
	icon: navbarMobileMenuToggleIcon,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: (props) =>
		Save({
			...props,
			// Pass block name to save component
			name: 'windmill-blocks/navbar-mobile-menu-toggle',
		}),
});

/** @ts-ignore */
registerBlockType(mega_menu_toggle_metadata, {
	...mega_menu_toggle_metadata,
	icon: megaMenuToggleIcon,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: (props) =>
		Save({
			...props,
			// Pass block name to save component
			name: 'windmill-blocks/mega-menu-toggle',
		}),
});
