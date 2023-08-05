<script lang="ts">
	import Searchbar from '$lib/components/Searchbar.svelte';
	import Weapon from '$lib/components/Weapon.svelte';
	import { filteredWeapons, weapons as weaponStore } from '$lib/stores/search';
	import { createQuery } from '@tanstack/svelte-query';
	import { get } from 'idb-keyval';
	import VirtualList from 'svelte-tiny-virtual-list';
	import type { WeaponLite } from '../lib/types/weaponTypes';
	import { words } from '$lib/stores/parser';

	const weapons = createQuery<WeaponLite[]>({
		queryKey: ['weapons'],
		queryFn: () => get<WeaponLite[]>('WeaponsLite').then((weapons) => (weapons ? weapons : []))
	});

	let gridHeight: number;
	let gridWidth: number;
	let rowColumns = 4;
	let itemHeight = 100 + 28;
	let itemWidth = 100 + 28;

	$: if ($weapons.data !== undefined) weaponStore.set($weapons.data);
	$: console.log($words);

	$: if (gridWidth > itemWidth) {
		rowColumns = Math.floor(gridWidth / itemWidth);
	} else {
		rowColumns = 1;
	}
</script>

<svelte:window bind:innerHeight={gridHeight} />
{#if $weapons.status === 'loading'}
	loading
{:else if $weapons.status === 'success'}
	<div class="grid grid-cols-[0.5fr_1fr]">
		<div class=" grid place-items-center bg-green-300 h-full w-full">
			<Searchbar />
		</div>
		<div class="text-white h-full" bind:clientWidth={gridWidth}>
			<VirtualList
				width="100%"
				height={gridHeight}
				itemCount={Math.ceil($weapons.data.length / rowColumns)}
				itemSize={itemHeight}
			>
				<div slot="item" let:index let:style {style}>
					<div class="row" style="--grid-columns: {rowColumns};">
						{#each Array(rowColumns) as _, i}
							{#if $filteredWeapons[index * rowColumns + i]}
								<Weapon weapon={$filteredWeapons[index * rowColumns + i]} />
							{/if}
						{/each}
					</div>
				</div>
			</VirtualList>
		</div>
	</div>
{/if}

<style>
	.row {
		display: grid;
		gap: 28px;
		margin-bottom: 28px;
		grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
	}
</style>
