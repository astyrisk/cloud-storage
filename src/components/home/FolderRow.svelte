<script>
	import { TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { goForwardDir } from '$lib/db.js';

	export let document;

	function handleGoToDir(e) {
		let dirName = e.target.tagName === "P" ? e.target.parentElement.parentElement.children[0].innerText : e.target.parentElement.children[0].innerText;
		goForwardDir(dirName);
	}
</script>

<TableBodyRow >
	<TableBodyCell style="cursor: pointer" on:click={handleGoToDir}>
		{document.name}
	</TableBodyCell>
</TableBodyRow>