import { getBlockTypes } from '@wordpress/blocks';
import { useMemo } from 'react';

/**
 * Typedefs
 */

/**
 * @typedef {Partial<import('@wordpress/blocks').Block<any>>[]} BlockBlackList
 */

/**
 * @typedef BlockBlackListOptions
 * @property {boolean} [inclusive] Only blacklist blocks that match all blacklist item properties
 * @property {BlockBlackListPredicate} [filterPredicate] Callback function called on each block to determine if it passes the blacklist. Overrides default blacklist predicate
 */

/**
 * @callback BlockBlackListPredicate
 * @param {import('@wordpress/blocks').Block<any>} block Current block the predicate is called upon
 * @param {BlockBlackList} blacklist Block blacklist array
 */

/**
 * Hooks
 */

/**
 * Get all registered block types except for blocks that matches any element in a given blacklist array
 *
 * @param {BlockBlackList} blacklist
 * @param {BlockBlackListOptions} [options]
 */
const useBlockBlacklist = (blacklist, options) => {
	/**
	 * @param {import('@wordpress/blocks').Block<any>} block
	 */
	const defaultPredicate = (block, blacklist_entries) => {
		/** @param {[string, any]} entry */
		const itemPredicate = ([entry_key, entry_value]) =>
			block[entry_key] === entry_value;

		return !blacklist_entries.some((list_item) =>
			options?.inclusive
				? list_item.every(itemPredicate)
				: list_item.some(itemPredicate)
		);
	};

	/** @type {BlockBlackListPredicate} */
	const filterPredicate =
		options?.filterPredicate === undefined
			? (block, blacklist) =>
					defaultPredicate(
						block,
						blacklist.map((item) => Object.entries(item))
					)
			: options.filterPredicate;

	return useMemo(
		() =>
			getBlockTypes().filter((block) =>
				filterPredicate(block, blacklist)
			),
		[]
	);
};

/**
 * Get all registered block types except for blocks that matches any name in a given blacklist array
 *
 * @param {string[]} blacklist
 */
useBlockBlacklist.byName = (blacklist) => {
	return useMemo(
		() =>
			getBlockTypes().filter((block) => !blacklist.includes(block.name)),
		[]
	);
};

/**
 * Private functions
 */

export default useBlockBlacklist;
