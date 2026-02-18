import * as TypeDefs from '../typedefs';

import { useRef } from 'react';

/**
 * Wordpress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { starFilled as placeholderIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import useIconBlockProps from '../props';
import IconInspectorControls from './inspector-controls';
import InlineIcon from '@/components/InlineIcon';

/**
 * Editor styles
 */
import '../styles/editor.scss';

/**
 * Typedefs
 */

/**
 * @typedef SizePresetObject
 * @property {string} name
 * @property {string} slug
 * @property {string|number} value
 */

/**
 * Hooks
 */

/**
 * Block editor component
 *
 * @param {import('@wordpress/blocks').BlockEditProps<TypeDefs.WindmillBlocksIconAttributes>} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { attributes } = props;
	const { icon, ariaLabel } = attributes;

	/**
	 * Hooks
	 */
	/** @type {React.Ref<import('@/components/InlineIcon').InlineIconRef>} */
	const inlineIconRef = useRef(null);

	const iconBlockProps = useIconBlockProps(attributes);
	const blockProps = useBlockProps({ ...iconBlockProps });

	/**
	 * Event Handlers
	 */

	/**
	 * Icon data update event handler
	 */
	const onIconDataUpdate = () => {
		if (inlineIconRef.current === null) {
			return;
		}
		inlineIconRef.current.fetchIcon();
	};

	return (
		<>
			{/* Block */}
			<span {...blockProps}>
				<InlineIcon
					ref={inlineIconRef}
					iconName={icon}
					placeholder={placeholderIcon}
					className="windmill-blocks-icon__inner-icon"
					width={24}
					height={24}
					ariaLabel={ariaLabel}
				/>
			</span>

			{/* Inspector */}
			<IconInspectorControls
				onIconDataUpdate={onIconDataUpdate}
				{...props}
			/>
		</>
	);
}
