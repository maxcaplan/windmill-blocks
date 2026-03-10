import * as TypeDefs from './typedefs';

import { useState } from 'react';

/**
 * Wordpress dependencies
 */
import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Editor styles
 */
import './styles/editor.scss';

/**
 * Block editor component
 *
 * @param {TypeDefs.WindmillBlocksMegaMenuEditProps} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { clientId } = props;

	/**
	 * State
	 */

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	/**
	 * Hooks
	 */

	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			'windmill-blocks/mega-menu-toggle',
			'windmill-blocks/mega-menu-menu',
		],
		template: [
			['windmill-blocks/mega-menu-toggle'],
			['windmill-blocks/mega-menu-menu'],
		],
	});

	return (
		<>
			<div
				{...innerBlockProps}
				{...(isMenuOpen ? { ['data-mega-menu-open']: true } : {})}
			/>

			<InspectorControls group="settings">
				<ToolsPanel
					label={__('Navbar')}
					panelId={clientId}
					resetAll={(filters) =>
						filters?.forEach((filter) => filter())
					}
				>
					<ToggleControl
						label={__('Show Menu')}
						checked={isMenuOpen}
						onChange={() => setIsMenuOpen((state) => !state)}
					/>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}
