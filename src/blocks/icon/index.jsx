import { registerBlockType } from '@wordpress/blocks';

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
/** @ts-ignore */
registerBlockType(metadata.name, {
	...metadata,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
});
