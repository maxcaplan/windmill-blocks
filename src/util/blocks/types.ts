export interface BlockMetadata<BindableAttributes extends string> {
	bindings?: {
		[key in BindableAttributes]?: {
			args?: Record<string, unknown>;
			source: string;
		};
	};
	[key: string]: unknown;
}
