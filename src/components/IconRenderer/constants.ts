/** Allowed tag names for icon svg child elements */
export const allowedIconChildTags = [
	'circle',
	'clipPath',
	'defs',
	'ellipse',
	'g',
	'line',
	'marker',
	'mask',
	'path',
	'polygon',
	'polyline',
	'rect',
] as const;

export type AllowedIconChildTag = (typeof allowedIconChildTags)[number];

/** Allowed attributes for all icon svg child elements */
export const allowedIconChildAttributes = [
	'clip-path',
	'clip-rule',
	'fill-rule',
	'marker-start',
	'marker-mid',
	'marker-end',
	'mask',
	'transform',
	'transform-box',
	'transform-origin',
	'visibility',
] as const;

/** Allowed attributes map for icon svg child elements */
export const allowedIconChildAttributesMap: Record<
	AllowedIconChildTag,
	string[]
> = {
	circle: ['cx', 'cy', 'r', 'pathLength'],
	clipPath: ['clipPathUnits'],
	defs: [],
	ellipse: ['cx', 'cy', 'rx', 'ry', 'pathLength'],
	g: [],
	line: ['x1', 'x2', 'y1', 'y2', 'pathLength'],
	marker: [
		'markerHeight',
		'markerUnits',
		'markerWidth',
		'orient',
		'preserveAspectRatio',
		'refX',
		'refY',
		'viewBox',
	],
	mask: [
		'height',
		'mask-type',
		'maskContentUnits',
		'maskUnits',
		'x',
		'y',
		'width',
	],
	path: ['d', 'pathLength'],
	polygon: ['points', 'pathLength'],
	polyline: ['points', 'pathLength'],
	rect: ['x', 'y', 'width', 'height', 'rx', 'ry', 'pathLength'],
} as const;

export type AllowedIconChildAttribute<Tag extends AllowedIconChildTag> =
	| (typeof allowedIconChildAttributes)[number]
	| (typeof allowedIconChildAttributesMap)[Tag][number];
