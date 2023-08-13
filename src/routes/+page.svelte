<script lang="ts">
	import Searchbar from '$lib/components/Searchbar.svelte';
	import { weapons as weaponStore } from '$lib/stores/search';
	import { createQuery } from '@tanstack/svelte-query';
	import { get } from 'idb-keyval';
	import type { WeaponLite } from '../lib/types/weaponTypes';

	const weapons = createQuery<WeaponLite[]>({
		queryKey: ['weapons'],
		queryFn: () => get<WeaponLite[]>('WeaponsLite').then((weapons) => (weapons ? weapons : []))
	});

	$: if ($weapons.data !== undefined) weaponStore.set($weapons.data);
</script>

{#if $weapons.status === 'loading'}
	loading
{:else if $weapons.status === 'success'}
	<main class="grid place-items-center w-full h-full">
		<div class="w-full h-full relative">
			<div class="absolute top-[20%] left-0 right-0 m-auto grid place-items-center">
				<Searchbar />
			</div>
		</div>
	</main>
{/if}
