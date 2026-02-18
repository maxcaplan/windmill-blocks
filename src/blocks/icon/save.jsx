import * as TypeDefs from './typedefs';

/**
 * Wordpress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import { starFilled as defaultIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */

import useIconBlockProps from './props';

/**
 * Serialized block component
 *
 * @param {import('@wordpress/blocks').BlockSaveProps<TypeDefs.WindmillBlocksIconAttributes>} props
 * @returns {React.JSX.Element}
 */
export default function Save(props) {
	const { attributes } = props;

	/**
	 * Hooks
	 */

	const iconBlockProps = useIconBlockProps(attributes);
	const blockProps = useBlockProps.save({ ...iconBlockProps });

	return <span {...blockProps} />;
}
