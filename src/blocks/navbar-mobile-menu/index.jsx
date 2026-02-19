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
import { mobile } from '@wordpress/icons';

/**
 * Register blocks
 */
/** @ts-ignore */
registerBlockType(metadata.name, {
	...metadata,
	icon: mobile,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});
