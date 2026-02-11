import * as TypeDefs from '../typedefs';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import ButtonInspectorControls from './inspector-controls';
import useButtonBlockProps from '../props';

/**
 * Editor styles
 */
import '../styles/editor.scss';

/**
 * Button block editor component
 *
 * @param {TypeDefs.WindmillBlocksButtonEditProps} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { attributes } = props;

	const buttonStyles = useButtonBlockProps(attributes);
	const blockProps = useBlockProps({ ...buttonStyles });

	const innerBlockProps = useInnerBlocksProps(blockProps);

	return (
		<>
			<div {...innerBlockProps} />

			<ButtonInspectorControls {...props} />
		</>
	);
}
