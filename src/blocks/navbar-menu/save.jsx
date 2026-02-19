import * as TypeDefs from './typedefs';

/**
 * Wordpress dependencies
 */
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * Serialized block component
 *
 * @param {TypeDefs.WindmillBlocksNavbarSaveProps} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	const blockProps = useBlockProps.save();
	const innerBlockProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlockProps} />;
}
