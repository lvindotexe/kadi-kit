<script lang="ts">
	import { browser } from '$app/environment';
	import { fetchTable } from '$lib/utils';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
	import { setMany, get } from 'idb-keyval';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { DatabaseTables, Weapon, WeaponLite } from '$lib/types/weaponTypes';
	import '../app.css';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	const cacheState = writable<{
		state: 'loading' | 'done' | 'error';
	}>({ state: 'loading' });

	function getLatestVersion() {
		return fetch('api/version').then((result) => result.json() as Promise<{ result: string }>);
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

	async function checkVersion() {
		const [cachedVersion, latestVersion] = await Promise.allSettled([
			get<string>('version'),
			getLatestVersion()
		]);
		const isUpToDate = cachedVersion === latestVersion;
		if (!isUpToDate) {
			const result = await updateManifestCache();
			cacheState.set({ state: result ? 'done' : 'error' });
		} else cacheState.set({ state: 'done' });
	}

	onMount(checkVersion);
</script>

<QueryClientProvider client={queryClient}>
	{#if $cacheState.state === 'loading'}
		loading
	{:else if $cacheState.state === 'done'}
		<slot />
	{:else if $cacheState.state === 'error'}
		error
	{/if}
</QueryClientProvider>
