/**
 * Wordpress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * Serialized block component
 *
 * @param {import('@wordpress/blocks').BlockSaveProps<{}>} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	return (
		<div {...useBlockProps.save()}>
			<InnerBlocks.Content />
		</div>
	);
}
