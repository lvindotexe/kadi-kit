<script lang="ts">
	import type { WeaponStore } from '$lib/stores/weapon';
	import type { InterpolationPoint } from 'bungie-api-ts/common';
	import { getContext } from 'svelte';
	
	const {stats} = getContext<WeaponStore>('weapon')
	

	function valueWithInterpolation<T extends {displayInterpolation:InterpolationPoint[],value:number}>(investmentStat:T) {
		const index = investmentStat.displayInterpolation.reduce((acc, curr, index, array) => {
			return Math.abs(investmentStat.value - array[index].value) <= Math.abs(investmentStat.value - array[acc].value)
				? index
				: acc;
		}, 0);
		return investmentStat.displayInterpolation[index].weight;
	}

	function statValue<T extends {value:number,displayInterpolation:InterpolationPoint[]}>(investmentStat:T){
		const value = investmentStat.displayInterpolation.length > 2 ? valueWithInterpolation(investmentStat) : investmentStat.value
		return value > 100 ? 100 : value
	}

</script>
<ul>
{#each $stats as [,{name,...rest}] }
	<li>
		{name}
		<progress value={statValue(rest)} max={100} />
	</li>
{/each}
</ul>

