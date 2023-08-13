<script lang="ts">
	import WeaponIcon from '$lib/components/weapons/WeaponIcon.svelte';
	import { previous } from '$lib/stores/previous';
	import { filteredWeapons, searchInput, searching } from '$lib/stores/search';
	import VirtualList from 'svelte-tiny-virtual-list';
	import { derived } from 'svelte/store';

	const pain = derived(searchInput, ($input) => ({ value: $input, length: $input.length }));
	const prev = previous(derived(searchInput, ($i) => ({ length: $i.length, value: $i })));
	// const prev = previous(searchInput);
	$: listHeight = 64 * $filteredWeapons.length;
	$: maxheight = listHeight > 500 ? 500 : listHeight;
	$filteredWeapons;
</script>

<div class="flex flex-col gap-2 text-white">
	<div>
		<input
			class="relative text-black rounded-md w-[min(700px,80vw)] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			type="text"
			name="search"
			id="search-input"
			bind:value={$searchInput}
			placeholder="Search Weapon"
		/>
	</div>
	{#if $searching}
		<p class="px-2"><span class="font-bold">{$filteredWeapons.length} </span> weapons found</p>
	{/if}
	<VirtualList
		width="100%"
		height={maxheight}
		itemCount={Math.ceil($filteredWeapons.length)}
		itemSize={64}
	>
		<li role="option" aria-selected="false" slot="item" let:index let:style {style}>
			<a class="flex gap-2 p-2" href={`/weapon/${$filteredWeapons[index].hash}`}>
				<WeaponIcon
					icon={$filteredWeapons[index].icon}
					iconWatermark={$filteredWeapons[index].iconWatermark}
					size={12}
				/>
				<div class="flex flex-col">
					<p class="uppercase font-bold text-elipsis">{$filteredWeapons[index].name}</p>
					<p class="italic text-ellipsis overflow-hidden">
						{$filteredWeapons[index].itemTypeAndTierDisplayName}
					</p>
				</div>
			</a>
		</li>
	</VirtualList>
</div>
