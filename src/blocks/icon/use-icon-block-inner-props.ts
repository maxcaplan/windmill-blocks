import clsx from 'clsx';
import { useMemo } from 'react';

import {
	__experimentalUseColorProps as useColorProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	getDimensionsClassesAndStyles as useDimensionsProps,
} from '@wordpress/block-editor';

import { IconBlockAttributes } from './types';

/**
 * Returns icon block inner props
 */
export const useIconBlockInnerProps = (attributes: IconBlockAttributes) => {
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

	return useMemo(() => {
		const {
			strokeWidth,
			nonScalingStroke,
			flipHorizontal,
			flipVertical,
			rotation,
		} = attributes;

		const stroke_props = {
			className: {
				'has-stroke-width': !!strokeWidth,
				'is-non-scaling-stroke': nonScalingStroke,
			},
			style: {},
		};

		const transform_props = {
			className: {
				'is-flip-horizontal': flipHorizontal,
				'is-flip-vertical': flipVertical,
			},
			style:
				isNaN(rotation) || rotation % 360 <= 0
					? {}
					: { rotate: `${rotation % 360}deg` },
		};

		return {
			className: clsx(
				color_props.className,
				border_props.className,
				spacing_props.className,
				dimension_props.className,
				stroke_props.className,
				transform_props.className
			),
			style: {
				...color_props.style,
				...border_props.style,
				...spacing_props.style,
				...dimension_props.style,
				...stroke_props.style,
				...transform_props.style,
			},
		};
	}, [attributes, color_props, border_props, spacing_props, dimension_props]);
};
