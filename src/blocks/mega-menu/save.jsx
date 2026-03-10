import * as TypeDefs from './typedefs';

/**
 * Wordpress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Serialized block component
 *
 * @param {TypeDefs.WindmillBlocksMegaMenuSaveProps} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	/**
	 * Hooks
	 */

	const blockProps = useBlockProps.save();
	const innerBlockProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlockProps} />;
}
