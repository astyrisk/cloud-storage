<script>
	import { TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { goForwardDir } from '$lib/db.js';

	export let document;
</script>

<TableBodyRow >
	<TableBodyCell style="cursor: pointer" on:click={goForwardDir}>
		{document.name}
	</TableBodyCell>
</TableBodyRow>
