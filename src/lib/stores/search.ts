import {
	ammoTypes,
	defaultDamageTypes,
	equipmentSlotTypes,
	itemCategories,
	tierTypes,
	type WeaponLite
} from '$lib/types/weaponTypes';
import { isNotNullOrUndefined } from '$lib/utils';
import { derived, writable } from 'svelte/store';

export type SearchStore = ReturnType<typeof useSearch>;

const keywords = [
	defaultDamageTypes,
	equipmentSlotTypes,
	ammoTypes,
	itemCategories,
	tierTypes
].flatMap(({ propertyHashes, filterImplementation, propertyName }) =>
	Object.entries(propertyHashes).map(
		([property, hash]) => [property, { hash, propertyName, filterImplementation }] as const
	)
);

export function useSearch(ws: WeaponLite[]) {
	const searchInput = writable('');
	const inputKeywords = derived(searchInput, ($input) => {
		const keywords = new Array<string>();
		const filteredWords = $input.split(/\s+/).filter((word) => {
			if (word.startsWith(':')) {
				keywords.push(word.slice(1, word.length));
				return false;
			}
			return true;
		});
		return {
			keywords: keywords,
			input: filteredWords.join(' ')
		};
	});

	const filters = derived(inputKeywords, ({ keywords: $keywords }) => {
		return keywords
			.filter(([property]) => $keywords.includes(property))
			.map(([_, { filterImplementation, hash, propertyName }]) => {
				//@ts-ignore slutty types
				return (weapon: WeaponLite) => filterImplementation([hash], weapon[propertyName]);
			})
			.filter(isNotNullOrUndefined);
	});
	const weapons = writable(ws);

	const searching = derived(searchInput, ($input) => $input.length > 0);

	const filteredWeapons = derived(
		[weapons, inputKeywords, filters],
		([$weapons, { input: $input }, $filters]) => {
			const hasFilters = $filters.length > 0;
			if (!hasFilters && $input.length < 1) return [];
			return hasFilters
				? $weapons.filter(
						(e) =>
							e.name.toLowerCase().includes($input.toLowerCase()) && $filters.every((f) => f(e))
				  )
				: $weapons.filter((e) => e.name.toLowerCase().includes($input.toLowerCase()));
		}
	);
	return { searchInput, filteredWeapons, searching };
}
