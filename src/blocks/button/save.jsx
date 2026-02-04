/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { BlockSaveProps } from '@wordpress/blocks';

/**
 * Serialized block component
 *
 * @param {BlockSaveProps<{}>} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	const { attributes } = props;
	const { tagName } = attributes;

	const isLink = tagName === 'a';

	const blockProps = useBlockProps.save();
	const innerBlockProps = useInnerBlocksProps.save(blockProps);

	if (isLink) {
		return <a role="button" {...innerBlockProps} />;
	} else {
		return <button role="button" {...innerBlockProps} />;
	}
}
