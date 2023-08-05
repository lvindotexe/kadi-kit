import {
	ammoTypes,
	defaultDamageTypes,
	equipmentSlotTypes,
	itemCategories,
	tierTypes
} from '$lib/types/weaponTypes';
import { searchInput } from './search';
import { derived } from 'svelte/store';

const pain = [defaultDamageTypes, equipmentSlotTypes, ammoTypes, itemCategories, tierTypes].reduce(
	(acc, { propertyHashes, propertyName, filterImplementation }) =>
		acc.set(propertyName, { propertyHashes, filterImplementation }),
	new Map()
);

export const words = derived(searchInput, ($searchInput) => parseInput($searchInput));

function parseInput(input: string): Readonly<[string[], string[]]> {
	const colon = new Array<string>();
	const noColon = new Array<string>();
	const words = input.split(/\s+/);

	for (const word of words) {
		if (word.endsWith(':')) {
			colon.push(word);
		} else {
			noColon.push(word);
		}
	}

	return [colon, noColon] as const;
}
