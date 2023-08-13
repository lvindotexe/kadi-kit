<script lang="ts">
	import { PUBLIC_BUNGIE_URL } from '$env/static/public';
	import type { WeaponStore } from '$lib/stores/weapon';
	import type { Weapon } from '$lib/types/weaponTypes';
	import { getContext } from 'svelte';
	export let perkColumn: Weapon['perks'][number] & { column: number };
	const { selectPerk, selectedPerks } = getContext<WeaponStore>('weapon');
	const { items, column } = perkColumn;
</script>

<ul class="flex flex-col gap-2">
	{#each Object.entries(items) as [hash, trait]}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<li
			class={`rounded-full grid place-items-center border ${
				$selectedPerks.has(Number(hash)) ? 'bg-blue-600' : ''
			}`}
			on:click={() => selectPerk(trait, column)}
		>
			<img src={PUBLIC_BUNGIE_URL + trait.icon} alt="" />
		</li>
	{/each}
</ul>
