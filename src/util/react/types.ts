/**
 * A react component render function
 *
 * @template Props Props to be spread on the rendered element
 * @template State Components internal state
 */
export type ComponentRenderFunction<Props, State> = (
	props: Props,
	state: State
) => React.ReactElement<unknown>;
