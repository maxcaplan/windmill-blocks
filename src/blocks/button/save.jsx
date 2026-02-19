/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import useButtonBlockProps from './props';
import { useMemo } from 'react';

/**
 * @typedef {{ tagName?: "a" | "button" } & React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>} BlockTagProps
 */

/**
 *
 * @param {Record<string, unknown> & BlockTagProps} props
 */
const BlockTag = ({ tagName, ...blockProps }) => {
	return tagName === 'a' ? (
		<a role="button" {...blockProps} />
	) : (
		<button role="button" {...blockProps} />
	);
};

/**
 * Serialized block component
 *
 * @param {import("./typedefs").WindmillBlocksButtonSaveProps & { name: string }} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	const { attributes, name } = props;
	const { tagName, url, linkTarget, rel } = attributes;

	const isButtonTag = tagName !== 'a';

	const isNavbarMobileMenuToggleButton =
		name === 'windmill-blocks/navbar-mobile-menu-toggle-button';

	/**
	 * Hooks
	 */

	const buttonStyles = useButtonBlockProps(
		attributes,
		isNavbarMobileMenuToggleButton
			? 'wp-block-windmill-blocks-button'
			: undefined
	);

	const blockProps = useBlockProps.save({ ...buttonStyles });
	const innerBlockProps = useInnerBlocksProps.save(blockProps);

	return (
		<BlockTag
			tagName={tagName}
			href={isButtonTag ? undefined : url}
			target={isButtonTag ? undefined : linkTarget}
			rel={isButtonTag ? undefined : rel}
			{...innerBlockProps}
		/>
	);
}
