<script>
	import { TableHead, TableHeadCell } from 'flowbite-svelte';
	import { getDoc } from "firebase/firestore";
	import {currentDirStore} from '$lib/store.js';

	// getDoc($currentDirStore.parent).then(x => {
	// // 	console.log(x.data().name)
	// });

	export let isRoot;
</script>
<TableHead>
	{#if isRoot}
		<TableHeadCell>ROOT DIRECTORY</TableHeadCell>
	{:else}
<!--		<TableHeadCell>{currentDirectoryDocumentData.name}</TableHeadCell>-->
		<TableHeadCell>{$currentDirStore.parent}</TableHeadCell>
	{/if}
</TableHead>
