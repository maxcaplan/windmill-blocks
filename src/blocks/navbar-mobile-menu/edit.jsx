import * as TypeDefs from './typedefs';

/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { useBlockBlackList } from '@/hooks';

/**
 * Editor styles
 */
import './styles/editor.scss';

const ALLOWED_BLOCKS_BLACKLIST = [
	'windmill-blocks/navigation',
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
	'core/post-comments-form',
	'core/post-comments-link',
	'core/post-navigation-link',
	'core/query-pagination',
	'core/query-pagination-next',
	'core/query-pagination-previous',
	'core/query-pagination-numbers',
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
 * Block editor component
 *
 * @param {TypeDefs.WindmillBlocksNavbarEditProps} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { attributes } = props;

	const {
		/** @ts-ignore */
		layout,
	} = attributes;

	/**
	 * Hooks
	 */

	const allowedBlocks = useBlockBlackList
		.byName(ALLOWED_BLOCKS_BLACKLIST)
		.map((block) => block.name);

	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: allowedBlocks,
		orientation: layout?.orientation ?? 'horizontal',
	});

	return (
		<>
			<div {...innerBlockProps} />
		</>
	);
}
