/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import {
	InspectorAdvancedControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
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
	const { attributes, setAttributes } = props;

	const tagName =
		attributes.tagName === 'a' || attributes.tagName === 'button'
			? attributes.tagName
			: 'button'; // Default to button if tagName is invalid

	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(blockProps);

	return (
		<>
			{/* Block */}
			<div {...innerBlockProps} />

			{/* Inspector */}
			<InspectorAdvancedControls>
				<SelectControl
					label={__('HTML Element')}
					options={[
						{ value: 'button', label: __('Default(<button>)') },
						{ value: 'a', label: '<a>' },
					]}
					value={tagName}
					onChange={(value) => setAttributes({ tagName: value })}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</InspectorAdvancedControls>
		</>
	);
}
