<script lang="ts">
	import { PUBLIC_BUNGIE_URL } from '$env/static/public';

	export let size: number;
	export let icon: string;
	export let iconWatermark: string;
</script>

<div class="relative border h-14 aspect-square">
	<img src={PUBLIC_BUNGIE_URL + icon} alt="" />
	<img class="absolute top-0 left-0" src={PUBLIC_BUNGIE_URL + iconWatermark} alt="" />
</div>
