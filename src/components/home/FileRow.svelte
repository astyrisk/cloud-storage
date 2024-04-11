<script>
	import { TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { downloadFile } from '$lib/db.js';
	import {currentPath} from '$lib/store.js';

	export let document;

</script>

<TableBodyRow>
	<TableBodyCell>{document.name}</TableBodyCell>
	<TableBodyCell on:click={downloadFile}>
		<p style="cursor: pointer"> Download </p>
	</TableBodyCell>
	<TableBodyCell>{document.type}</TableBodyCell>
	<TableBodyCell>{document.size}</TableBodyCell>
</TableBodyRow>
