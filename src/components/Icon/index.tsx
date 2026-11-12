import clsx from 'clsx';
import { useMemo } from 'react';

import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticeStore } from '@wordpress/notices';

import { IconRenderer } from '@/components';
import { iconStore } from '@/stores';
import { ICON_STATUS, context as iconsContext } from '@/stores/icons';
import { parseErrorMessage } from '@/util/error';

import { IconComponent, IconInnerComponent } from './types';

import './styles.scss';

const COMPONENT_BLOCK_CLASS = 'wm-blocks-icon-component';

/**
 * Get components className string
 *
 * @param className className passed to component
 * @param modifiers Component block class modifiers
 */
const componentClassname = (
	className?: string,
	...modifiers: (string | undefined)[]
) =>
	clsx(
		COMPONENT_BLOCK_CLASS,
		// Reduce modifiers to className string
		modifiers.reduce(
			(className, modifier) =>
				!modifier
					? className
					: `${className} ${COMPONENT_BLOCK_CLASS}--${modifier}`,
			''
		),
		className
	);

const IconInner: IconInnerComponent = ({
	icon,
	className,
	renderPlaceholder,
	renderLoading,
	renderError,
	...props
}) => {
	const { data, error, status } = useSelect(
		(select) => select(iconStore).getIcon(icon),
		[icon]
	);

	const { createErrorNotice, removeNotice } = useDispatch(noticeStore);

	const is_rendering_loading = useMemo(
		() =>
			!!renderLoading &&
			(status === ICON_STATUS.LOADING ||
				status === ICON_STATUS.REFRESHING),
		[renderLoading, status]
	);

	const is_rendering_icon = useMemo(
		() => !is_rendering_loading && !!data,
		[is_rendering_loading, data]
	);

	const is_rendering_error = useMemo(
		() =>
			!!renderError && !is_rendering_icon && status === ICON_STATUS.ERROR,
		[renderError, is_rendering_icon, status]
	);

	const is_rendering_placeholder = useMemo(
		() =>
			!!renderPlaceholder &&
			!is_rendering_error &&
			!is_rendering_loading &&
			!is_rendering_icon,
		[
			renderPlaceholder,
			is_rendering_error,
			is_rendering_loading,
			is_rendering_icon,
		]
	);

	return (
		<>
			{is_rendering_icon && !!data && (
				<IconRenderer
					{...props}
					content={data.content}
					className={componentClassname(className, icon)}
					onError={(error) =>
						createErrorNotice(
							`Failed to render icon "${icon}": ${parseErrorMessage(error)}`,
							{
								context: iconsContext,
								id: `${icon}/render`,
								type: 'default',
								isDismissible: false,
							}
						)
					}
					onSuccess={() =>
						removeNotice(`${icon}/render`, iconsContext)
					}
				/>
			)}
			{is_rendering_placeholder && (
				<>
					{renderPlaceholder?.(
						{
							...props,
							className: componentClassname(
								className,
								icon,
								'placeholder'
							),
						},
						{
							icon,
							data,
							error,
							status,
						}
					)}
				</>
			)}
			{is_rendering_loading && (
				<>
					{renderLoading?.(
						{
							...props,
							className: componentClassname(
								className,
								icon,
								'loading'
							),
						},
						{
							icon,
							data,
							error,
							status,
						}
					)}
				</>
			)}
			{is_rendering_error &&
				renderError?.(
					{
						...props,
						className: componentClassname(className, icon, 'error'),
					},
					{
						icon,
						data,
						error,
						status,
					}
				)}
		</>
	);
};

/**
 * Render an inline SVG for a given icon name
 */
export const Icon: IconComponent = ({
	icon,
	renderPlaceholder,
	className,
	'aria-hidden': ariaHidden = 'true',
	...props
}) => {
	return (
		<>
			{!!icon && (
				<IconInner
					{...props}
					icon={icon}
					renderPlaceholder={renderPlaceholder}
					className={className}
					aria-hidden={ariaHidden}
				/>
			)}
			{!icon && (
				<>
					{renderPlaceholder?.(
						{
							...props,
							'aria-hidden': ariaHidden,
							className: componentClassname(
								className,
								icon,
								'placeholder'
							),
						},
						{}
					)}
				</>
			)}
		</>
	);
};
