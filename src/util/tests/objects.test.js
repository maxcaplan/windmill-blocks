import { expect, test } from '@jest/globals';
import { deepFilter, hasProperties } from '../objects';
import { cloneDeep, merge } from 'lodash';

test('Object is correctly filtered of undefined and null values', () => {
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

test('Object has all properties for a list of keys', () => {
	const obj = { a: 1, b: 2, c: 3 };

	expect(hasProperties(obj, ['a'])).toEqual(true);
	expect(hasProperties(obj, ['a', 'b'])).toEqual(true);
	expect(hasProperties(obj, ['a', 'b', 'c'])).toEqual(true);

	expect(hasProperties(obj, ['b'])).toEqual(true);
	expect(hasProperties(obj, ['c', 'b'])).toEqual(true);
	expect(hasProperties(obj, ['c', 'a', 'b'])).toEqual(true);
});

test('Object does not have all properties for a list of keys', () => {
	const obj = { a: 1, b: 2, c: 3 };

	expect(hasProperties(obj, ['d'])).toEqual(false);
	expect(hasProperties(obj, ['a', 'b', 'd'])).toEqual(false);
	expect(hasProperties(obj, ['a', 'b', 'c', 'd'])).toEqual(false);
});

test('Object has all properties and passes predicate for a list of keys', () => {
	const obj = { a: 1, b: 2, c: 3 };
	const predicate = ([_, value]) => typeof value === 'number';

	expect(hasProperties(obj, ['a'], predicate)).toEqual(true);
	expect(hasProperties(obj, ['a', 'b'], predicate)).toEqual(true);
	expect(hasProperties(obj, ['a', 'b', 'c'], predicate)).toEqual(true);
});

test('Object has all properties but does not pass predicate for a list of keys', () => {
	const obj = { a: 1, b: 2, c: 'three' };
	const predicate = ([_, value]) => typeof value === 'number';

	expect(hasProperties(obj, ['a', 'b', 'c'], predicate)).toEqual(false);
});
