import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/** Frontend styles */
import './styles/style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

/**
 * Wordpress dependencies
 */
import { desktop, mobile } from '@wordpress/icons';

/**
 * Register blocks
 */
/** @ts-ignore */
registerBlockType('windmill-blocks/navbar-desktop', {
	...metadata,
	name: 'windmill-blocks/navbar-desktop',
	title: 'Navbar Desktop',
	icon: desktop,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});

/** @ts-ignore */
registerBlockType('windmill-blocks/navbar-mobile', {
	...metadata,
	name: 'windmill-blocks/navbar-mobile',
	title: 'Navbar Mobile',
	icon: mobile,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});
