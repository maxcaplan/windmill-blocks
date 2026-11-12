import clsx from 'clsx';
import { SVG, Path, Rect } from '@wordpress/components';

import './styles.scss';

/**
 * Placeholder SVG graphic
 */
export const PlaceholderGraphic = ({
	className,
	xmlns = 'http://www.w3.org/2000/svg',
	viewBox = '0 0 60 60',
	preserveAspectRatio = 'none',
	fill = 'currentColor',
	fillOpacity = 0.1,
	stroke = 'currentColor',
	strokeOpacity = 0.25,
	'aria-hidden': ariaHidden = 'true',
	...props
}: React.SVGAttributes<SVGSVGElement>): React.JSX.Element => {
	return (
		<SVG
			{...props}
			className={clsx(
				'wm-blocks-placholder-graphic-component',
				className
			)}
			xmlns={xmlns}
			viewBox={viewBox}
			preserveAspectRatio={preserveAspectRatio}
			fill="none"
			aria-hidden={ariaHidden}
		>
			<Rect
				width="60"
				height="60"
				fill={fill}
				fillOpacity={fillOpacity}
				stroke="none"
			/>
			<Path
				vectorEffect="non-scaling-stroke"
				stroke={stroke}
				strokeOpacity={strokeOpacity}
				d="M60 60 0 0"
			/>
		</SVG>
	);
};
