import type { FilterImplementation, WeaponLite } from '$lib/types/weaponTypes';
import { isNotNullOrUndefined } from '$lib/utils';
import { derived, writable } from 'svelte/store';

export const searchInput = writable('');
const selectedPropertiesStore = writable<
	Map<string, { hashes: Array<number>; filter: FilterImplementation<keyof WeaponLite> }>
>(new Map());
const filters = derived(selectedPropertiesStore, ($selectedPropertiesStore) => {
	const entries = [...$selectedPropertiesStore.entries()];
	return entries
		.map(([key, { hashes, filter }]) => {
			return hashes.length > 0
				? (weapon: WeaponLite) => {
						//@ts-expect-error slutty types
						return filter(hashes, weapon[key]);
				  }
				: undefined;
		})
		.filter(isNotNullOrUndefined);
});
export const weapons = writable<WeaponLite[]>([]);

export function select(name: string, hash: number, filter: FilterImplementation<keyof WeaponLite>) {
	selectedPropertiesStore.update((prev) => {
		const oldValues = prev.get(name);
		return new Map([...prev]).set(name, {
			hashes: oldValues ? [...oldValues!.hashes, hash] : [hash],
			filter
		});
	});
}

export function remove(name: string, hash: number) {
	selectedPropertiesStore.update((prev) => {
		const value = prev.get(name);
		if (!value) return prev;
		const { hashes, filter } = value;
		return new Map(prev).set(name, { hashes: hashes.filter((e) => e !== hash), filter });
	});
}

export const filteredWeapons = derived(
	[weapons, searchInput, filters],
	([$weapons, $searchInput, $filters]) => {
		const weapons = $weapons.filter((e) =>
			e.name.toLowerCase().includes($searchInput.toLowerCase())
		);
		return $filters.length > 0 ? weapons.filter((e) => $filters.every((f) => f(e))) : weapons;
	}
);
