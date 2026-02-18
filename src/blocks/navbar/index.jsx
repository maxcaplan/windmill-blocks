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
import { navigation as blockIcon } from '@wordpress/icons';

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
