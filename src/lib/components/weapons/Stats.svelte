<script lang="ts">
	import type { Weapon } from '$lib/types/weaponTypes';
	import type { InterpolationPoint } from 'bungie-api-ts/common';

	export let entry: Entries<Weapon['investmentStats']>;
	const [hash, { name, statTypeHash, value, description, displayInterpolation }] = entry;

	function getActualStatValue(value: number, interpolationPoints: Array<InterpolationPoint>) {
		const index = interpolationPoints.reduce((acc, curr, index, array) => {
			return Math.abs(value - array[index].value) <= Math.abs(value - array[acc].value)
				? index
				: acc;
		}, 0);
		return interpolationPoints[index].weight;
	}
	console.log(entry, hash === '1240592695');
	if (hash === '1240592695') console.log(value);

	const actualValue =
		displayInterpolation.length > 2 ? getActualStatValue(value, displayInterpolation) : value;
</script>

<div>
	{name}
	<progress value={actualValue > 100 ? 100 : actualValue} max={100} />
</div>
