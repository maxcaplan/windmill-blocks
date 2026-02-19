import * as TypeDefs from '../typedefs';

import { useMemo, useRef, useState } from 'react';

/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useMergeRefs } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import useButtonBlockProps from '../props';
import ButtonBlockControls from './block-controls';
import ButtonInspectorControls from './inspector-controls';
import { useBlockBlackList } from '@/hooks';

/**
 * Editor styles
 */
import '../styles/editor.scss';

const ALLOWED_BLOCKS_BLACKLIST = [
	'windmill-blocks/button',
	'windmill-blocks/button-group',
	'windmill-blocks/navbar-mobile-menu-toggle',
	'windmill-blocks/navbar-mobile-menu-toggle-button',
	'core/button',
	'core/buttons',
	'core/accordion',
	'core/accordion-heading',
	'core/accordion-panel',
	'core/accordion-item',
	'core/comment-edit-link',
	'core/comment-reply-link',
	'core/comments-pagination',
	'core/comments-pagination-next',
	'core/comments-pagination-previous',
	'core/comments-pagination-numbers',
	'core/embed',
	'core/file',
	'core/form',
	'core/form-input',
	'core/form-submission-notification',
	'core/form-submit-button',
	'core/home-link',
	'core/loginout',
	'core/navigation',
	'core/post-comments-form',
	'core/post-comments-link',
	'core/post-navigation-link',
	'core/query-pagination',
	'core/query-pagination-next',
	'core/query-pagination-previous',
	'core/query-pagination-numbers',
	'core/search',
	'core/read-more',
	'core/tab',
	'core/tab-panel',
	'core/tabs',
	'core/tabs-menu',
	'core/tabs-menu-item',
	'core/table-of-contents',
	'core/video',
];

/**
 * Button block editor component
 *
 * @param {TypeDefs.WindmillBlocksButtonEditProps & { name: string }} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { attributes, name } = props;
	const {
		/** @ts-ignore */
		layout,
	} = attributes;

	const isNavbarMobileMenuToggleButton =
		name === 'windmill-blocks/navbar-mobile-menu-toggle-button';

	/**
	 * State
	 */

	const [popoverAnchor, setPopoverAnchor] = useState(
		/** @type {Element|null} */ (null)
	);

	/**
	 * Hooks
	 */

	const blockRef = useRef(/** @type {Element|null} */ (null));

	const allowedBlocks = useBlockBlackList
		.byName(ALLOWED_BLOCKS_BLACKLIST)
		.map((block) => block.name);

	const buttonStyles = useButtonBlockProps(
		attributes,
		isNavbarMobileMenuToggleButton
			? 'wp-block-windmill-blocks-button'
			: undefined
	);

	const blockProps = useBlockProps({
		...buttonStyles,
		ref: useMergeRefs([setPopoverAnchor, blockRef]),
	});

	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks,
		orientation: layout?.orientation ?? 'horizontal',
	});

	return (
		<>
			<div {...innerBlockProps} />

			<ButtonBlockControls {...props} popoverAnchor={popoverAnchor} />
			<ButtonInspectorControls {...props} />
		</>
	);
}
