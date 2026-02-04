import { registerBlockType } from '@wordpress/blocks';

/** Frontend styles */
import './styles/style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

/**
 * Register block
 */
registerBlockType(metadata.name, {
	...metadata,
	/** Editor component */
	edit: Edit,
	/** Serialized component */
	save: Save,
	/** Dynamic block editor label */
	__experimentalLabel(attributes, { context }) {
		const { text } = attributes;

		const customName = attributes?.metadata?.name;
		const hasContent = text?.trim().length > 0;

		// Replace block label if block has custom name or text content
		if (customName || hasContent) {
			// In the list view, use custom name or block text
			if (context === 'list-view') {
				return customName || text;
			}

			// In the breadcrumb view, only use custom name
			if (context === 'breadcrumb' && customName) {
				return customName;
			}
		}
	},
});
