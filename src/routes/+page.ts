import { browser } from '$app/environment';
import type { DatabaseTables, Weapon, WeaponLite } from '$lib/types/weaponTypes';
import { redirect } from '@sveltejs/kit';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { get, setMany } from 'idb-keyval';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	async function fetchTable<T extends keyof DatabaseTables>(tableName: T) {
		const response = await fetch(`/api/${tableName}`);
		if (!response.ok) return new Error('unknown tableName');
		return response.json() as Promise<DatabaseTables[T]>;
	}

	async function updateManifestCache() {
		const tableRequests = [
			'Catalysts',
			'MasterWork',
			'Ornaments',
			'Traits',
			'WeaponMods',
			'Weapons',
			'WeaponsLite',
			'version'
		].map(async (e) => [e, await fetchTable(e as keyof DatabaseTables)] as const);
		const tables: Array<[string, DestinyInventoryItemDefinition[] | Weapon[] | WeaponLite[]]> = [];
		for await (const [tableName, result] of tableRequests) {
			//@ts-expect-error slutty types
			if (!(result instanceof Error)) tables.push([tableName, result]);
		}
		await setMany(tables);
		return true;
	}

	if (browser) {
		const [cachedVersion, latestVersion] = await Promise.allSettled([
			get<string>('version'),
			fetch('api/version').then((result) => result.json() as Promise<{ result: string }>)
		]);
		const isUpToDate = cachedVersion === latestVersion;
		//TODO away of doing retry's and better error handling
		if (!isUpToDate) await updateManifestCache();
		const weapons = await fetchTable('WeaponsLite');
		if (weapons instanceof Error) throw redirect(307, '/500');
		return { weapons };
	}
};
