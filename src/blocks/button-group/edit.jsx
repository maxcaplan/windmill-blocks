/**
 * Wordpress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { BlockEditProps } from '@wordpress/blocks';

/**
 * Editor styles
 */
import './styles/editor.scss';

/**
 * Block editor component
 *
 * @param {BlockEditProps<{}>} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { attributes } = props;
	const { layout } = attributes;

	return (
		<>
			<div {...useBlockProps()}>
				<InnerBlocks
					allowedBlocks={['windmill-blocks/button']}
					template={[['windmill-blocks/button']]}
					templateInsertUpdatesSelection={true}
					orientation={layout?.orientation ?? 'horizontal'}
				/>
			</div>
		</>
	);
}
