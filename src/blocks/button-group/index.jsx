/**
 * Wordpress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	buttons as blockIcon,
	menu as navbarMobileMenuToggleIcon,
} from '@wordpress/icons';

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
registerBlockType(metadata.name, {
	...metadata,
	icon: blockIcon,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});

/** @ts-ignore */
registerBlockType('windmill-blocks/navbar-mobile-menu-toggle', {
	...metadata,
	name: 'windmill-blocks/navbar-mobile-menu-toggle',
	title: 'Navbar Mobile Menu Toggle',
	icon: navbarMobileMenuToggleIcon,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});
