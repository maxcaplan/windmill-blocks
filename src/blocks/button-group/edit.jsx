/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Editor styles
 */
import './styles/editor.scss';
import { useMemo } from 'react';

/**
 * Block editor component
 *
 * @param {import('@wordpress/blocks').BlockEditProps<{}> & { name: string }} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { attributes, name } = props;
	const {
		/** @ts-ignore */
		layout,
	} = attributes;

	const isNavbarMobileMenuToggle =
		name === 'windmill-blocks/navbar-mobile-menu-toggle';

	/**
	 * Hooks
	 */

	const blockProps = useBlockProps({
		className: isNavbarMobileMenuToggle
			? 'wp-block-windmill-blocks-button-group'
			: undefined,
	});
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			isNavbarMobileMenuToggle
				? 'windmill-blocks/navbar-mobile-menu-toggle-button'
				: 'windmill-blocks/button',
		],
		template: [
			[
				isNavbarMobileMenuToggle
					? 'windmill-blocks/navbar-mobile-menu-toggle-button'
					: 'windmill-blocks/button',
			],
		],
		templateInsertUpdatesSelection: true,
		orientation: layout?.orientation ?? 'horizontal',
	});

	return <div {...innerBlockProps} />;
}
