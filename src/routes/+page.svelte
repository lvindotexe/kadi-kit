<script lang="ts">
	import Searchbar from '$lib/components/Searchbar.svelte';
	import { setContext } from 'svelte';
	import type { PageData } from './$types';
	import { useSearch } from '$lib/stores/search';
	export let data: PageData;
	const { weapons } = data;
	setContext('search', useSearch(weapons!));
</script>

<main class="grid place-items-center w-full h-full">
	<div class="w-full h-full relative">
		<div class="absolute top-[20%] left-0 right-0 m-auto grid place-items-center">
			<Searchbar />
		</div>
	</div>
</main>
