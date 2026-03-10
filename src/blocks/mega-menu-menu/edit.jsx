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
import { useEffect, useRef, useState } from 'react';

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
 * @param {import('@wordpress/blocks').BlockEditProps<{}>} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { attributes } = props;

	const {
		/** @ts-ignore */
		layout,
	} = attributes;

	const [visualEditorElement, setVisualEditorElement] = useState(
		/** @type {HTMLIFrameElement|null} */
		(null)
	);

	const [observer, setObserver] = useState(
		/** @type {IntersectionObserver|undefined} */ (undefined)
	);

	const [menuOffset, setMenuOffset] = useState(0);
	const [menuHeight, setMenuHeight] = useState(0);

	/**
	 * Hooks
	 */
	const ref = useRef(/** @type {HTMLDivElement|null} */ (null));

	const allowedBlocks = useBlockBlackList
		.byName(ALLOWED_BLOCKS_BLACKLIST)
		.map((block) => block.name);

	const blockProps = useBlockProps({ ref });
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks,
		orientation: layout?.orientation ?? 'horizontal',
	});

	/**
	 * Update the position of the menu to stick to the left side of the visual editor
	 */
	const updateMenuPosition = () => {
		if (ref.current === null) {
			return;
		}

		const menu_rect = ref.current.getBoundingClientRect();

		setMenuHeight(menu_rect.height);
		setMenuOffset((value) => value - menu_rect.x);
	};

	/** Update menu position on visual editor resize or menu visibility change */
	useEffect(() => {
		if (ref.current === null) {
			return;
		}

		/** @type {HTMLIFrameElement|null} */
		const visual_editor_element = document.querySelector(
			'.edit-site-visual-editor__editor-canvas'
		);

		if (visual_editor_element === null) {
			console.error('Failed to get visual editor canvas DOM element');
			return;
		}

		setVisualEditorElement(visual_editor_element);

		visual_editor_element.contentWindow?.addEventListener(
			'resize',
			updateMenuPosition
		);

		const intersection_observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					updateMenuPosition();
				} else {
					setMenuHeight(0);
				}
			});
		});
		intersection_observer.observe(ref.current);

		setObserver(intersection_observer);

		return () => {
			visualEditorElement?.contentWindow?.removeEventListener(
				'resize',
				updateMenuPosition
			);

			observer?.disconnect();
		};
	}, []);

	/** Center visual editor with menu height */
	useEffect(() => {
		if (visualEditorElement === null) {
			return;
		}

		visualEditorElement.style.transform = `translateY(-${menuHeight / 2}px)`;
	}, [menuHeight]);

	return (
		<div
			{...innerBlockProps}
			style={{
				left: `${menuOffset}px`,
			}}
		/>
	);
}
