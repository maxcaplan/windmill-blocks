import '@wordpress/block-editor';

declare module '@wordpress/block-editor' {
	export function __experimentalUseColorProps(attributes: Object): {
		className?: string;
		style: Record<string, unknow>;
	};

	export function __experimentalUseBorderProps(attributes: Object): {
		className?: string;
		style: Record<string, unknow>;
	};

	export function __experimentalGetSpacingClassesAndStyles(
		attributes: Object
	): {
		className?: string;
		style: Record<string, unknow>;
	};

	export function getDimensionsClassesAndStyles(attributes: Object): {
		className?: string;
		style: Record<string, unknow>;
	};

	export function __experimentalGetShadowClassesAndStyles(
		attributes: Object
	): {
		className?: string;
		style: Record<string, unknow>;
	};
}
