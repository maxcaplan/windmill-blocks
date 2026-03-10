/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Serialized block component
 *
 * @param {import('@wordpress/blocks').BlockSaveProps<{}> & { name: string }} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	const { name } = props;

	const isVariant =
		name === 'windmill-blocks/navbar-mobile-menu-toggle' ||
		name === 'windmill-blocks/mega-menu-toggle';

	/**
	 * Hooks
	 */

	const blockProps = useBlockProps.save({
		className: isVariant
			? 'wp-block-windmill-blocks-button-group'
			: undefined,
	});
	const innerBlockProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlockProps} />;
}
