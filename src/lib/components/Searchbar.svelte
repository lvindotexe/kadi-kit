<script lang="ts">
	import { searchInput, updateInput } from '$lib/stores/search';
	import WeaponPropertySelect from './WeaponPropertySelect.svelte';
	import {
		tierTypes,
		defaultDamageTypes,
		equipmentSlotTypes,
		ammoTypes,
		itemCategories
	} from '$lib/types/weaponTypes';
</script>

<input type="text" name="search" id="search-input" on:input={(e) => updateInput(e.target.value)} />
<WeaponPropertySelect propertyDefinitions={tierTypes} name={'Tier'} />
<WeaponPropertySelect propertyDefinitions={defaultDamageTypes} name={'Element'} />
<WeaponPropertySelect propertyDefinitions={equipmentSlotTypes} name={'Slot'} />
<WeaponPropertySelect propertyDefinitions={ammoTypes} name={'Ammunition'} />
<WeaponPropertySelect propertyDefinitions={itemCategories} name={'Archetype'} />
