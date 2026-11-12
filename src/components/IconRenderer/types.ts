//
// Component types
//

export type IconRendererComponent = React.ComponentType<IconRendererProps>;

//
// Component prop types
//

export interface IconRendererProps extends React.SVGAttributes<SVGSVGElement> {
	ref?: React.Ref<SVGSVGElement>;
	content: string;
	onError?: (error: unknown) => void;
	onSuccess?: () => void;
}
