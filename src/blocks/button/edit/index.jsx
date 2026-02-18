import * as TypeDefs from '../typedefs';

import { useRef, useState } from 'react';

/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { useBlockBlacklist } from '@/hooks/use-block-blacklist';
import useButtonBlockProps from '../props';
import ButtonBlockControls from './block-controls';
import ButtonInspectorControls from './inspector-controls';

const ALLOWED_BLOCKS_BLACKLIST = [
	'windmill-blocks/button',
	'windmill-blocks/button-group',
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
 * Editor styles
 */
import '../styles/editor.scss';
import { useMergeRefs } from '@wordpress/compose';

/**
 * Button block editor component
 *
 * @param {TypeDefs.WindmillBlocksButtonEditProps} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { attributes } = props;
	const {
		/** @ts-ignore */
		layout,
	} = attributes;

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

	const allowedBlocks = useBlockBlacklist
		.byName(ALLOWED_BLOCKS_BLACKLIST)
		.map((block) => block.name);

	const buttonStyles = useButtonBlockProps(attributes);
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
