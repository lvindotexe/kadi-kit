<script lang="ts">
	import { PUBLIC_BUNGIE_URL } from '$env/static/public';
	import type { Weapon } from '../../types/weaponTypes';

	export let weapon: Weapon;
</script>

<img src={PUBLIC_BUNGIE_URL + weapon.icon} alt="" />
