import * as TypeDefs from '../typedefs';

import { useState } from 'react';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { square as sizeIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useThemeSettingsObjects } from '@/hooks/use-theme-settings';
import { PresetUnitControl } from '@/components/PresetUnitControl';
import UploadIconControl from './upload-icon-control';
import PickIconControl from './pick-icon-control';

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
 * @typedef IconInspectorControlsProps
 * @property {(value: TypeDefs.IconData) => void} [onIconDataUpdate]
 */

/**
 * Block editor component
 *
 * @param {import('@wordpress/blocks').BlockEditProps<TypeDefs.WindmillBlocksIconAttributes> & IconInspectorControlsProps} props
 * @returns {React.JSX.Element}
 */
export default function IconInspectorControls(props) {
	const { attributes, setAttributes, clientId, onIconDataUpdate } = props;
	const { size, icon } = attributes;

	/**
	 * State
	 */

	const [iconData, setIconData] = useState(
		/** @type {TypeDefs.IconData[]} */ ([])
	);

	/**
	 * Hooks
	 */

	const size_presets = useThemeSettingsObjects('spacing.spacingSizes', {
		name: 'string',
		slug: 'string',
		size: 'string',
	}).map(({ name, slug, size }) => ({
		name,
		slug,
		value: size,
	}));

	/**
	 * Upload icon control value change event handler
	 *
	 * @param {TypeDefs.IconData} value
	 */
	const onUploadIconChange = (value) => {
		setIconData(iconData.concat([value]));
	};

	return (
		<>
			<InspectorControls group="settings">
				<ToolsPanel
					label={__('Icon')}
					panelId={clientId}
					resetAll={(filters) =>
						filters?.forEach((filter) => filter())
					}
				>
					<ToolsPanelItem
						label={__('Size')}
						panelId={clientId}
						hasValue={() => size !== undefined}
						resetAllFilter={() =>
							setAttributes({
								size: undefined,
							})
						}
						onDeselect={() =>
							setAttributes({
								size: undefined,
							})
						}
						defaultChecked={true}
						isShownByDefault={true}
					>
						<PresetUnitControl
							label="size"
							icon={sizeIcon}
							value={size}
							onChange={(value) =>
								setAttributes({
									size:
										value === undefined
											? undefined
											: value.toString(),
								})
							}
							presets={size_presets}
							presetCategory="spacing"
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						label={__('Icon')}
						panelId={clientId}
						hasValue={() => icon !== undefined}
						resetAllFilter={() =>
							setAttributes({ icon: undefined })
						}
						onDeselect={() => setAttributes({ icon: undefined })}
						defaultChecked={true}
						isShownByDefault={true}
						className="icon-controls-tools-panel-item"
					>
						<PickIconControl
							iconData={iconData}
							value={icon}
							onChange={(value) =>
								setAttributes({ icon: value?.filename })
							}
							onUpdate={onIconDataUpdate}
						/>

						<UploadIconControl onChange={onUploadIconChange} />
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}
