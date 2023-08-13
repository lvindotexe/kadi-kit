import type { FilterImplementation, Weapon, WeaponLite } from '$lib/types/weaponTypes';
import { isNotNullOrUndefined } from '$lib/utils';
import { derived, writable } from 'svelte/store';

export type SearchStore = ReturnType<typeof useSearch>;

export function useSearch(ws: WeaponLite[]) {
	const searchInput = writable('');
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
	const weapons = writable(ws);

	const searching = derived(
		[searchInput, selectedPropertiesStore],
		([$searchInput, $selectedpropertiesStore]) => {
			return (
				$searchInput.length > 0 ||
				[...$selectedpropertiesStore.values()].flatMap(({ hashes }) => hashes).length > 0
			);
		}
	);

	function select(name: string, hash: number, filter: FilterImplementation<keyof WeaponLite>) {
		selectedPropertiesStore.update((prev) => {
			const oldValues = prev.get(name);
			return new Map([...prev]).set(name, {
				hashes: oldValues ? [...oldValues!.hashes, hash] : [hash],
				filter
			});
		});
	}

	function remove(name: string, hash: number) {
		selectedPropertiesStore.update((prev) => {
			const value = prev.get(name);
			if (!value) return prev;
			const { hashes, filter } = value;
			return new Map(prev).set(name, { hashes: hashes.filter((e) => e !== hash), filter });
		});
	}

	const filteredWeapons = derived(
		[weapons, searchInput, filters],
		([$weapons, $searchInput, $filters]) => {
			const hasFilters = $filters.length > 0;
			if (!hasFilters && $searchInput.length < 1) return [];
			return hasFilters
				? $weapons.filter(
						(e) =>
							$filters.every((f) => f(e)) &&
							e.name.toLowerCase().includes($searchInput.toLowerCase())
				  )
				: $weapons.filter((e) => e.name.toLowerCase().includes($searchInput.toLowerCase()));
		}
	);
	return { searchInput, filteredWeapons, searching, select, remove };
}
