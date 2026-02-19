/**
 * Wordpress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { mobile as mobileIcon, desktop as desktopIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

/** Frontend styles */
import './styles/style.scss';

const desktop_metadata = {
	...metadata,
	name: 'windmill-blocks/navbar-desktop',
	title: 'Navbar Desktop',
	icon: desktopIcon,
};

const mobile_metadata = {
	...metadata,
	name: 'windmill-blocks/navbar-mobile',
	title: 'Navbar Mobile',
	icon: mobileIcon,
};

/**
 * Register block
 */

/** @ts-ignore */
registerBlockType(desktop_metadata.name, {
	...desktop_metadata,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});

/** @ts-ignore */
registerBlockType(mobile_metadata.name, {
	...mobile_metadata,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});
