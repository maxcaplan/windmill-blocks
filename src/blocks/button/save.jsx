/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import useButtonBlockProps from './props';

/**
 *
 * @param {Record<string, unknown> & { tagName?: "a" | "button", role: string }} props
 */
const BlockTag = ({ tagName, ...blockProps }) => {
	return tagName === 'a' ? <a {...blockProps} /> : <button {...blockProps} />;
};

/**
 * Serialized block component
 *
 * @param {import("./typedefs").WindmillBlocksButtonSaveProps} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	const { attributes } = props;
	const { tagName } = attributes;

	const buttonStyles = useButtonBlockProps.save(attributes);

	const blockProps = useBlockProps.save({ ...buttonStyles });
	const innerBlockProps = useInnerBlocksProps.save(blockProps);

	return <BlockTag tagName={tagName} role="button" {...innerBlockProps} />;
}
