<script>
	import { TableHead, TableHeadCell } from 'flowbite-svelte';
	export let isRoot;
</script>
<TableHead>
	{#if isRoot}
		<TableHeadCell>ROOT DIRECTORY</TableHeadCell>
	{:else}
<!--		<TableHeadCell>{currentDirectoryDocumentData.name}</TableHeadCell>-->
		<TableHeadCell>hi</TableHeadCell>
	{/if}
</TableHead>
