import clsx from 'clsx';

import {
	ToolbarButton,
	ToggleControl,
	Spinner,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { Tooltip, InputControl } from '@wordpress/ui';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import { getBlockBindingsSource } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import {
	flipHorizontal as flipHorizontalIcon,
	flipVertical as flipVerticalIcon,
	rotateRight as rotateIcon,
	lock as lockIcon,
} from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

import { Icon, IconControl, PlaceholderGraphic } from '@/components';

import { IconBlockEditComponent, IconBlockBindableAttributes } from './types';
import { useIconBlockInnerProps } from './use-icon-block-inner-props';

import './styles/editor.scss';

/** Icon block edit component */
const Edit: IconBlockEditComponent = ({
	attributes,
	setAttributes,
	isSelected,
	context,
}) => {
	const {
		icon,
		flipHorizontal,
		flipVertical,
		rotation,
		ariaLabel,
		strokeWidth,
		nonScalingStroke,
		metadata,
	} = attributes;

	const inner_props = useIconBlockInnerProps(attributes);

	const binding_attributes = useSelect(
		(select) => {
			if (!isSelected) {
				return {};
			}

			return Object.entries(metadata?.bindings || {}).reduce(
				(attributes, [attribute, binding]) => {
					const binding_source = getBlockBindingsSource(
						binding.source
					);

					attributes[attribute] = {
						is_locked: !binding_source?.canUserEditValue?.({
							select,
							context,
							args: binding.args,
						}),

						locked_message: binding_source?.label
							? sprintf(
									/* translators: %s: Label of the bindings source. */
									__('Connected to %s'),
									binding_source.label
								)
							: __('Connected to dynamic data'),
					};

					return attributes;
				},
				{} as {
					[key in IconBlockBindableAttributes]?: {
						is_locked: boolean;
						locked_message: string;
					};
				}
			);
		},
		[isSelected, context, metadata?.bindings]
	);

	/** Whether all controls in block block controls group are locked */
	const is_block_controls_block_locked =
		!!binding_attributes.flipHorizontal?.is_locked &&
		!!binding_attributes.flipVertical?.is_locked &&
		!!binding_attributes.rotation?.is_locked;

	/** Whether all controls in other block controls group are locked */
	const is_block_controls_other_locked = !!binding_attributes.icon?.is_locked;

	/**
	 * Set rotation attribute
	 */
	const setRotation = (value: number) =>
		setAttributes({
			rotation: Math.max((isNaN(value) ? 0 : value) % 360, 0),
		});

	return (
		<>
			<span {...useBlockProps()}>
				<Icon
					{...inner_props}
					icon={icon}
					strokeWidth={strokeWidth}
					renderPlaceholder={({ className, ...props }) => (
						<PlaceholderGraphic
							{...props}
							{...inner_props}
							className={clsx(className, inner_props.className)}
						/>
					)}
					renderLoading={({ className, ...props }) => (
						<Spinner
							{...props}
							{...inner_props}
							className={clsx(className, inner_props.className)}
						/>
					)}
				/>
			</span>

			{!is_block_controls_block_locked && (
				<BlockControls group="block">
					{!binding_attributes.flipHorizontal?.is_locked && (
						<ToolbarButton
							label={__('Flip horizontal')}
							icon={flipHorizontalIcon}
							isPressed={flipHorizontal === true}
							onClick={() => {
								setAttributes({
									flipHorizontal: !flipHorizontal,
								});
							}}
						/>
					)}

					{!binding_attributes.flipVertical?.is_locked && (
						<ToolbarButton
							label={__('Flip vertical')}
							icon={flipVerticalIcon}
							isPressed={flipVertical === true}
							onClick={() => {
								setAttributes({ flipVertical: !flipVertical });
							}}
						/>
					)}

					{!binding_attributes.rotation?.is_locked && (
						<ToolbarButton
							label={__('Rotate')}
							icon={rotateIcon}
							onClick={() => {
								setRotation(rotation + 90);
							}}
						/>
					)}
				</BlockControls>
			)}

			{!is_block_controls_other_locked && (
				<BlockControls group="other">
					{!binding_attributes.icon?.is_locked && (
						<IconControl
							value={icon}
							onChange={(value) => setAttributes({ icon: value })}
							renderLabel={({}, { value }) =>
								!!value ? __('Replace') : __('Add icon')
							}
							renderToggle={(props) => (
								<ToolbarButton
									{...props}
									__next40pxDefaultSize
								/>
							)}
						/>
					)}
				</BlockControls>
			)}

			<InspectorControls group="content">
				<ToolsPanel
					label={__('Icon')}
					resetAll={() => {
						setAttributes({
							icon: undefined,
							ariaLabel: undefined,
						});
					}}
				>
					<ToolsPanelItem
						label={__('Icon')}
						hasValue={() => !!icon}
						onDeselect={() => setAttributes({ icon: undefined })}
						isShownByDefault
					>
						<IconControl
							value={icon}
							onChange={(value) => setAttributes({ icon: value })}
							disabled={!!binding_attributes.icon?.is_locked}
							tooltip={binding_attributes.icon?.locked_message}
							withDropzone
							withResetButton
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						label={__('Label')}
						isShownByDefault
						hasValue={() => !!ariaLabel}
						onDeselect={() =>
							setAttributes({ ariaLabel: undefined })
						}
					>
						{!binding_attributes.ariaLabel?.is_locked && (
							<InputControl
								label={__('Label')}
								description={__(
									'A short description of the icon for screen readers. Leave blank if icon is decorative.',
									'windmill-data'
								)}
								value={ariaLabel || ''}
								onValueChange={(value) =>
									setAttributes({
										ariaLabel: value || undefined,
									})
								}
							/>
						)}
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={__('Stroke')}
					resetAll={() =>
						setAttributes({
							strokeWidth: undefined,
							nonScalingStroke: false,
						})
					}
				>
					{!binding_attributes.strokeWidth?.is_locked && (
						<ToolsPanelItem
							label={__('Stroke width')}
							hasValue={() => !!strokeWidth}
							onDeselect={() =>
								setAttributes({ strokeWidth: undefined })
							}
						>
							<UnitControl
								label={__('Stroke width')}
								value={strokeWidth}
								onChange={(value?: string) =>
									setAttributes({
										strokeWidth: value,
									})
								}
							/>
						</ToolsPanelItem>
					)}

					{!binding_attributes.nonScalingStroke?.is_locked && (
						<ToolsPanelItem
							label={__('Stroke Scaling')}
							hasValue={() => !!nonScalingStroke}
							onDeselect={() =>
								setAttributes({ nonScalingStroke: false })
							}
						>
							<ToggleControl
								label={__('Non scaling stroke')}
								help="Don't scale stroke width with size of the icon"
								checked={!!nonScalingStroke}
								onChange={(value) =>
									setAttributes({ nonScalingStroke: value })
								}
							/>
						</ToolsPanelItem>
					)}
				</ToolsPanel>

				<ToolsPanel
					label={__('Transform')}
					resetAll={() => {
						setAttributes({
							flipHorizontal: false,
							flipVertical: false,
							rotation: 0,
						});
					}}
				>
					{!binding_attributes.flipHorizontal?.is_locked && (
						<ToolsPanelItem
							label={__('Flip horizontal', 'windmill-blocks')}
							hasValue={() => !!flipHorizontal}
							onDeselect={() =>
								setAttributes({
									flipHorizontal: false,
								})
							}
						>
							<ToggleControl
								label={__('Flip horizontal')}
								checked={!!flipHorizontal}
								onChange={(value) =>
									setAttributes({ flipHorizontal: value })
								}
							/>
						</ToolsPanelItem>
					)}

					{!binding_attributes.flipVertical?.is_locked && (
						<ToolsPanelItem
							label={__('Flip vertical', 'windmill-blocks')}
							hasValue={() => !!flipVertical}
							onDeselect={() =>
								setAttributes({
									flipVertical: false,
								})
							}
						>
							<ToggleControl
								label={__('Flip vertical')}
								checked={!!flipVertical}
								onChange={(value) =>
									setAttributes({ flipVertical: value })
								}
							/>
						</ToolsPanelItem>
					)}

					{!binding_attributes.rotation?.is_locked && (
						<ToolsPanelItem
							label={__('Rotation')}
							hasValue={() => !!rotation}
							onDeselect={() => setAttributes({ rotation: 0 })}
						>
							<ToggleGroupControl
								label={__('Rotation')}
								isBlock
								value={rotation}
								onChange={(value) => {
									if (typeof value === 'number') {
										setAttributes({ rotation: value });
									}
								}}
							>
								<ToggleGroupControlOption label="0" value={0} />
								<ToggleGroupControlOption
									label="90"
									value={90}
								/>
								<ToggleGroupControlOption
									label="180"
									value={180}
								/>
								<ToggleGroupControlOption
									label="270"
									value={270}
								/>
							</ToggleGroupControl>
						</ToolsPanelItem>
					)}
				</ToolsPanel>
			</InspectorControls>
		</>
	);
};

export default Edit;
