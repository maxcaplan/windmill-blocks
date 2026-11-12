//
// Component types
//

import { ICON_STATUS, IconData } from '@/stores/icons';
import { ComponentRenderFunction } from '@/util/react';

export type IconComponent = (props: IconProps) => React.JSX.Element;
export type IconInnerComponent = (props: IconInnerProps) => React.JSX.Element;

//
// Component prop types
//

export interface RenderPlacheholderState {
	icon?: string;
	error?: unknown;
	data?: IconData | null;
	status?: ICON_STATUS;
}

export interface RenderLoadingState {
	icon: string;
	error: unknown;
	data: IconData | null;
	status: ICON_STATUS;
}

export interface RenderErrorState {
	icon: string;
	error: unknown;
	data: IconData | null;
	status: ICON_STATUS;
}

export interface IconProps extends Omit<
	React.SVGAttributes<SVGSVGElement>,
	'onError'
> {
	/** Icon name */
	icon?: string;

	ref?: React.Ref<SVGSVGElement>;

	/** Render callback to display a placeholder when there is no loaded icon. */
	renderPlaceholder?: ComponentRenderFunction<
		React.SVGAttributes<SVGSVGElement>,
		RenderPlacheholderState
	>;

	/** Render callback for when the icon is loading. Overrides renderPlaceholder */
	renderLoading?: ComponentRenderFunction<
		React.SVGAttributes<SVGSVGElement>,
		RenderLoadingState
	>;

	/** Render callback for when the icon has an error. Overrides renderPlaceholder */
	renderError?: ComponentRenderFunction<
		React.SVGAttributes<SVGSVGElement>,
		RenderErrorState
	>;
}

export interface IconInnerProps extends IconProps {
	/** Icon name */
	icon: string;
}
