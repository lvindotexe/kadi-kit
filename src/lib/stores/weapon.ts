import type { Catalyst, MasterWork, Mod, Trait, Weapon } from '$lib/types/weaponTypes';
import { isNotNullOrUndefined } from '$lib/utils';
import { derived, get, readonly, writable } from 'svelte/store';

export type WeaponStore = ReturnType<typeof useWeapon>;

export function useWeapon(w: Weapon) {
	const weapon = writable<Weapon>(w);
	const selectedSockets = writable<Map<string, Mod | MasterWork | Catalyst | undefined>>(new Map());
	const selectedPerks = writable<Map<number, Trait | undefined>>(new Map());
	const stats = derived(
		[selectedPerks, selectedSockets, weapon],
		([$selectedPerks, $selectedSockets, $weapon]) => {
			const statMaps = [...$selectedPerks.values(), ...$selectedSockets.values()]
				.flatMap((e) => e?.investmentStats)
				.filter(isNotNullOrUndefined)
				.reduce((statMods, { statTypeHash, value }) => {
					return statMods.has(statTypeHash)
						? statMods.set(statTypeHash, statMods.get(statTypeHash)! + value)
						: statMods.set(statTypeHash, value);
				}, new Map<number, number>());
			const statEntries = Object.entries($weapon.investmentStats).map(([hash, invStat]) => {
				if (statMaps.has(Number(hash)))
					return [
						hash,
						{ ...invStat, value: statMaps.get(Number(hash))! + invStat.value }
					] as const;
				else return [hash, invStat] as const;
			});
			return new Map(statEntries);
		}
	);

	function setBanner(banner: string) {
		const weaponValue = get(weapon);
		const defaultBanner = weaponValue ? weaponValue.screenshot : undefined;
		weapon.update((prev) =>
			prev ? { ...prev, screenshot: banner === prev.screenshot ? defaultBanner! : banner } : prev
		);
	}

	function selectPerk(trait: Trait, column: number) {
		selectedPerks.update((prev) => {
			if (prev.get(column)?.hash === trait.hash) prev.delete(column);
			else prev.set(column, trait);
			return new Map([...prev]);
		});
	}

	function selectSockets(socketType: string, plug: Mod | MasterWork | Catalyst) {
		selectedSockets.update((prev) => {
			if (prev.get(socketType)?.hash === plug.hash) prev.delete(socketType);
			else prev.set(socketType, plug);
			return new Map([...prev]);
		});
	}

	return { setBanner, selectPerk, selectSockets, stats, selectedPerks: readonly(selectedSockets) };
}
