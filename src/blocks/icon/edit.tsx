import { useMemo } from 'react';
import clsx from 'clsx';

import {
	ToolbarButton,
	TextControl,
	ToggleControl,
	Spinner,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	__experimentalUseColorProps as useColorProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	getDimensionsClassesAndStyles as useDimensionsProps,
} from '@wordpress/block-editor';
import {
	flipHorizontal as flipHorizontalIcon,
	flipVertical as flipVerticalIcon,
	rotateRight as rotateIcon,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { Icon, IconControl, PlaceholderGraphic } from '@/components';

import { IconBlockEditComponent } from './types';

import './styles/editor.scss';

/** Icon block edit component */
const Edit: IconBlockEditComponent = ({ attributes, setAttributes }) => {
	const {
		icon,
		flipHorizontal,
		flipVertical,
		rotation,
		ariaLabel,
		strokeWidth,
		nonScalingStroke,
	} = attributes;

	const color_props = useColorProps(attributes);
	const border_props = useBorderProps(attributes);
	const spacing_props = useSpacingProps({
		style: {
			// Only get padding spacing props as margin is serialized
			spacing: {
				/** @ts-ignore */
				padding: attributes.style?.spacing?.padding,
			},
		},
	});
	const dimension_props = useDimensionsProps(attributes);

	const inner_props = useMemo(
		() => ({
			className: clsx(
				color_props.className,
				border_props.className,
				spacing_props.className,
				dimension_props.className,
				{
					'is-flip-horizontal': flipHorizontal,
					'is-flip-vertical': flipVertical,
				},
				{ 'is-non-scaling-stroke': nonScalingStroke },
				{ 'has-stroke-width': !!strokeWidth }
			),
			style: {
				...color_props.style,
				...border_props.style,
				...spacing_props.style,
				...dimension_props.style,
				...(isNaN(rotation) || rotation % 360 <= 0
					? {}
					: { rotate: `${rotation % 360}deg` }),
			} as Record<string, unknown>,
		}),
		[
			color_props,
			border_props,
			spacing_props,
			dimension_props,
			flipHorizontal,
			flipVertical,
			nonScalingStroke,
			rotation,
		]
	);

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

			<BlockControls group="block">
				<ToolbarButton
					label={__('Flip horizontal')}
					icon={flipHorizontalIcon}
					isPressed={flipHorizontal === true}
					onClick={() => {
						setAttributes({ flipHorizontal: !flipHorizontal });
					}}
				/>
				<ToolbarButton
					label={__('Flip vertical')}
					icon={flipVerticalIcon}
					isPressed={flipVertical === true}
					onClick={() => {
						setAttributes({ flipVertical: !flipVertical });
					}}
				/>
				<ToolbarButton
					label={__('Rotate')}
					icon={rotateIcon}
					onClick={() => {
						setRotation(rotation + 90);
					}}
				/>
			</BlockControls>

			<BlockControls group="other">
				<IconControl
					value={icon}
					onChange={(value) => setAttributes({ icon: value })}
					label={({ value }) =>
						!!value ? __('Replace') : __('Add icon')
					}
					renderToggle={({ isOpen, children, onToggle }) => (
						<ToolbarButton
							aria-haspopup="true"
							aria-expanded={isOpen}
							onClick={() => onToggle()}
							__next40pxDefaultSize
						>
							{children}
						</ToolbarButton>
					)}
					dropzone={false}
					resetButton={false}
				/>
			</BlockControls>

			<InspectorControls group="content">
				<ToolsPanel
					label={__('Icon')}
					resetAll={() => {
						setAttributes({
							icon: undefined,
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
						/>
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
							<ToggleGroupControlOption label="90" value={90} />
							<ToggleGroupControlOption label="180" value={180} />
							<ToggleGroupControlOption label="270" value={270} />
						</ToggleGroupControl>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<InspectorControls group="settings">
				<ToolsPanel
					label={__('Settings')}
					resetAll={() => setAttributes({ ariaLabel: undefined })}
				>
					<ToolsPanelItem
						label={__('Label')}
						isShownByDefault
						hasValue={() => !!ariaLabel}
						onDeselect={() =>
							setAttributes({ ariaLabel: undefined })
						}
					>
						<TextControl
							label={__('Label')}
							help={__(
								'A short description of the icon for screen readers. Leave blank if icon is decorative.'
							)}
							value={ariaLabel || ''}
							onChange={(value) =>
								setAttributes({ ariaLabel: value || undefined })
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
};

export default Edit;
