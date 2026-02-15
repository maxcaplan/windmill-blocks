/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Editor styles
 */
import './styles/editor.scss';

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

	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ['windmill-blocks/icon'],
		template: [['windmill-blocks/icon']],
		templateInsertUpdatesSelection: true,
		orientation: layout?.orientation ?? 'horizontal',
	});

	return <div {...innerBlockProps} />;
}
