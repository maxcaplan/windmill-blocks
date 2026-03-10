import * as TypeDefs from './typedefs';

/**
 * Wordpress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Serialized block component
 *
 * @param {TypeDefs.WindmillBlocksNavbarSaveProps} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	return <InnerBlocks.Content />;
}
