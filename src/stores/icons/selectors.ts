import { EMPTY_ICON, ICON_STATUS } from './constants';
import { Icon, IconStoreState } from './types';

/**
 * Get the state object for a given icon
 */
export const getIcon = (state: IconStoreState, name: string): Icon =>
	state[name] ?? EMPTY_ICON;

/**
 * Get the status of an icon
 */
export const getIconStatus = (
	state: IconStoreState,
	name: string
): ICON_STATUS => (state[name] ?? EMPTY_ICON).status;

/**
 * Get all icon names that include a search string
 */
export const nameIncludes = (state: IconStoreState, search: string) =>
	Object.keys(state).filter((name) => name.includes(search));

/**
 * PRIVATE SELECTOR.
 * Get the unresolved state object for a given icon
 */
export const _getIconUnresolved = (state: IconStoreState, name: string): Icon =>
	state[name] ?? EMPTY_ICON;
