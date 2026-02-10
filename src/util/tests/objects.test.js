import { expect, test } from '@jest/globals';
import { deepFilter } from '../objects';
import { cloneDeep, merge } from 'lodash';

test('Object null and undefined filtering', () => {
	const obj = { a: 1, b: 2 };
	const merged = merge(cloneDeep(obj), {
		b: null,
		c: { d: 3, e: null },
	});
	const filtered = deepFilter(
		merged,
		({ value }) => value !== null && value !== undefined
	);

	expect(filtered).not.toEqual(merged);
	expect(filtered).toEqual({ a: 1, c: { d: 3 } });
});
