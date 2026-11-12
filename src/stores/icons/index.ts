/**
 * Windmill Blocks Icon API data store
 */

import { createReduxStore, register, select } from '@wordpress/data';

import { STORE_NAME } from './constants';

import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as resolvers from './resolvers';

const store = createReduxStore(STORE_NAME, {
	reducer,
	actions,
	selectors,
	resolvers,
});

if (!select(STORE_NAME)) {
	register(store);
}

export { store, STORE_NAME };

export { ICON_STATUS, context } from './constants';
export type { IconData } from './types';
