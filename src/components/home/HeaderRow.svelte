<script>
	import { collection } from 'firebase/firestore';
	import { TableHead, TableHeadCell } from 'flowbite-svelte';
	import {rootDir, currentDir, currentPath} from '$lib/store.js';
	import {updateData} from '$lib/db.js';

	const docRef= $currentDir.parent;
	export let isRoot;

	for (let i = 0; i < $currentPath.length; i++){
	}

	function goToRoot() {
		currentDir.set($rootDir);
		$currentPath = [];
		updateData();
	}

	function goTo(dirDoc) {
		let i;
		for (i = 0; i < $currentPath.length; i++) {
			if (dirDoc.id == $currentPath[i].id) {
				break;
			}
		}
	  currentDir.set(collection(dirDoc.ref, "folder"));
		$currentPath = $currentPath.slice(0, i+1);
		updateData();
	}
</script>
<TableHead>
		<TableHeadCell>
			<p on:click={goToRoot} style="cursor: pointer; display: inline;">ROOT/</p>
			{#each $currentPath as curr}
				<p on:click={goTo(curr)} style="cursor: pointer; display: inline;">{curr.data().name}/</p>
			{/each}
		</TableHeadCell>
</TableHead>
