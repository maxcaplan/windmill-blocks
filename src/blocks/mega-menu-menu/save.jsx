/**
 * Wordpress dependencies
 */
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * Serialized block component
 *
 * @param {import('@wordpress/blocks').BlockSaveProps} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	/**
	 * Hooks
	 */

	const blockProps = useBlockProps.save();
	const innerBlockProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlockProps} />;
}
