<script>
	import { TableHead, TableHeadCell } from 'flowbite-svelte';
	import {currentDirStore, currentPath} from '$lib/store.js';
	const docRef= $currentDirStore.parent;
	export let isRoot;

	let current = [];
	for (let i = $currentPath.length - 1; i >= 0; i--) {
		if ($currentPath[i] === "root") {
			console.log("Found root at index", i);
			break;
		} else {
		}
	}

	function goToRoot() {
	}

	function goTo() {
	}

	console.log(($currentPath).slice(-1))
</script>
<TableHead>
		<TableHeadCell>
			<p on:click={goToRoot} style="cursor: pointer; display: inline;">ROOT/</p>
			{#each $currentPath as curr}
				<p on:click={goTo} style="cursor: pointer; display: inline;">{curr.name}/</p>
			{/each}
		</TableHeadCell>
</TableHead>
