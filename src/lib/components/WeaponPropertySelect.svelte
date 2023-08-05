<script lang="ts">
	import { select, remove } from '$lib/stores/search';
	import type {
		NonRecordWeaponLiteProperties,
		WeaponRecordPropertyDefinition
	} from '$lib/types/weaponTypes';

	export let propertyDefinitions: WeaponRecordPropertyDefinition<NonRecordWeaponLiteProperties>;
	export let name: string;
	const { propertyHashes, propertyName, filterImplementation } = propertyDefinitions;
</script>

<fieldset>
	<legend>{name}</legend>
	{#each Object.entries(propertyHashes) as [name, hash]}
		<span>
			<input
				type="checkbox"
				id={`${name}-${hash}`}
				on:change={(e) => {
					{
						const { target } = e;
						if (!(target instanceof HTMLInputElement)) return;
						if (target.checked) select(propertyName, hash, filterImplementation);
						else remove(propertyName, hash);
					}
				}}
			/>
			<label for={`${name}-${hash}`}>{name.replace('_', ' ')}</label>
		</span>
	{/each}
</fieldset>
