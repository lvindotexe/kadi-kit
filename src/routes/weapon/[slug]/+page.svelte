<script lang="ts">
	import PerkColumn from '$lib/components/weapons/PerkColumn.svelte';
	import Stats from '$lib/components/weapons/Stats.svelte';
	import WeaponIcon from '$lib/components/weapons/WeaponIcon.svelte';
	import { useWeapon } from '$lib/stores/weapon';
	import { setContext } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { weapon } = data;
	const { perks } = weapon;
	const weaponStore = useWeapon(weapon);
	setContext('weapon', weaponStore);
	const { stats } = weaponStore;
	$: console.log([...$stats.entries()].filter(([k]) => k === '1240592695').map(([k,v]) => v.value));
</script>

<main class="text-white">
	<div class="flex text-white gap-2 items-center">
		<WeaponIcon icon={weapon.icon} iconWatermark={weapon.iconWatermark} size={12} />
		<div>
			<p class="font-bold">{weapon.name}</p>
			<p class="italic">{weapon.itemTypeAndTierDisplayName}</p>
		</div>
	</div>
	<div class="flex">
		{#each perks as column, i}
			<PerkColumn perkColumn={{ ...column, column: i }} />
		{/each}
	</div>
	{#each $stats as entry}
		<Stats {entry} />
	{/each}
</main>
