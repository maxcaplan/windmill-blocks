/**
 * Wordpress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { BlockSaveProps } from '@wordpress/blocks';

/**
 * Serialized block component
 *
 * @param {BlockSaveProps<{}>} props
 * @returns {React.JSX.Element}
 */
export default function Save() {
	return (
		<div {...useBlockProps.save()}>
			<InnerBlocks.Content />
		</div>
	);
}
