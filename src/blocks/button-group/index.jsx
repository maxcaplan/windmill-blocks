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
 * Register block
 */
registerBlockType(metadata.name, {
	...metadata,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});
