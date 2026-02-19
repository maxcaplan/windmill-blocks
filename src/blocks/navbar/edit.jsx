import * as TypeDefs from './typedefs';

import { useMemo, useState } from 'react';

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
import { resizeCornerNE as breakpointIcon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PresetUnitControl } from '@/components/PresetUnitControl';
import { useThemeSettingsObjects } from '@/hooks';
import { presetStringParts } from '@/util/theme';

/**
 * Editor styles
 */
import './styles/editor.scss';

/**
 * Block editor component
 *
 * @param {TypeDefs.WindmillBlocksNavbarEditProps} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	const { attributes, setAttributes, clientId } = props;
	const { desktopBreakpoint } = attributes;

	/**
	 * State
	 */

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	/**
	 * Hooks
	 */
	const spacingSizes = useThemeSettingsObjects('spacing.spacingSizes', {
		name: 'string',
		slug: 'string',
		size: 'string',
	});

	const breakpointWidth = useMemo(() => {
		const breakpoint_value =
			desktopBreakpoint === undefined ? '600px' : desktopBreakpoint;
		const preset = presetStringParts(breakpoint_value);
		const preset_value =
			preset?.slug === undefined
				? undefined
				: spacingSizes.find((size) => size.slug === preset.slug)?.size;

		return preset_value ?? breakpoint_value;
	}, [desktopBreakpoint, spacingSizes]);

	const mediaQueryCss = useMemo(() => {
		return `@media only screen and (max-width: ${breakpointWidth}) {
	.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-desktop  {
		display: none !important;
	}

	.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-mobile,
	.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-mobile-menu {
		display: flex !important;
	}
}

.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-desktop {
	display: flex;
}

.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-mobile,
.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-mobile-menu {
	display: none;
}`;
	}, [breakpointWidth]);

	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			'windmill-blocks/navbar-inner',
			'windmill-blocks/navbar-mobile-menu',
		],
		template: [
			['windmill-blocks/navbar-inner'],
			['windmill-blocks/navbar-mobile-menu'],
		],
	});

	return (
		<>
			<style className="windmill-blocks-navbar-breakpoint-styles">
				{mediaQueryCss}
			</style>

			<nav
				{...innerBlockProps}
				{...(isMenuOpen ? { ['data-mobile-menu-open']: true } : {})}
			/>

			<InspectorControls group="settings">
				<ToolsPanel
					label={__('Navbar')}
					panelId={clientId}
					resetAll={(filters) =>
						filters?.forEach((filter) => filter())
					}
				>
					<ToolsPanelItem
						label={__('Size')}
						panelId={clientId}
						hasValue={() => desktopBreakpoint !== undefined}
						resetAllFilter={() =>
							setAttributes({
								desktopBreakpoint: undefined,
							})
						}
						onDeselect={() =>
							setAttributes({
								desktopBreakpoint: undefined,
							})
						}
						defaultChecked={true}
						isShownByDefault={true}
					>
						<PresetUnitControl
							label={__('Desktop Breakpoint')}
							icon={breakpointIcon}
							value={desktopBreakpoint}
							onChange={(value) =>
								setAttributes({
									desktopBreakpoint:
										value === undefined
											? undefined
											: value.toString(),
								})
							}
						/>
					</ToolsPanelItem>

					<ToggleControl
						label={__('Show Mobile Menu')}
						checked={isMenuOpen}
						onChange={() => setIsMenuOpen((state) => !state)}
					/>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}
