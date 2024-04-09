<script>
	// https://www.npmjs.com/package/exiftool
	import { getApp } from 'firebase/app';
	import { getAuth} from 'firebase/auth';
	import { collection, doc, addDoc, setDoc, getDocs, getFirestore } from 'firebase/firestore/lite';
	import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
	import { goBackDir, getDirDocs, getDirDocsData } from '$lib/db.js';
	import {currentDirStore, currentElementsData} from '$lib/store.js';
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import FolderRow from './FolderRow.svelte';
	import FileRow from './FileRow.svelte';
	import HeaderRow from './HeaderRow.svelte';

	const app = getApp();
	const auth = getAuth();
	const db = getFirestore(app);

	//TODO move to stores
	let selectedFile = null;

	const user = auth.currentUser;
	const userDocRef = doc(db, "Users", user.uid);

	currentDirStore.set(collection(userDocRef, "root"));
	getDirDocsData($currentDirStore).then(x => $currentElementsData = x);

	function handleFileChange(event) {
		const file = event.target.files[0];
		if (file) {
			selectedFile = {
				name: file.name,
				size: (file.size / 1024).toFixed(2) + ' KB',
				type: file.type,
				isFile: true,
				ref: "images" + file.name
			};
			addDoc($currentDirStore, selectedFile);
			getDirDocsData($currentDirStore).then(x => $currentElementsData = x);
		}
	}

	function handleNewFile() {
		let file = document.getElementById('fileInput').click();
	}

	function handleNewFolder() {
		let name = prompt("new folder name: ");
		addDoc($currentDirStore, {
			name: name,
			isFile: false,
			parent: $currentDirStore,
		});
		getDirDocsData($currentDirStore).then(x => $currentElementsData = x);
	}

	async function handleGoBackDir() {
		goBackDir($currentDirStore);
	}
</script>

<input type="file" id="fileInput" style="display: none;" on:change={handleFileChange} />
<main>
	<ButtonGroup>
		<Button on:click={handleNewFile}>New File</Button>
		<Button on:click={handleNewFolder}>New Folder</Button>
	</ButtonGroup>

	<div class="table">
		<Table>
			<HeaderRow isRoot={($currentDirStore).id === "root"} />
		<TableBody>
			{#if ($currentDirStore).id !== "root"}
				<TableBodyRow >
					<TableBodyCell style="cursor: pointer" on:click={handleGoBackDir}>
						<p> .. </p>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
			{#each $currentElementsData as document}
				{#if !document.isFile}
					<FolderRow {document} />
				{/if}
			{/each}

			{#each $currentElementsData as document}
				{#if document.isFile}
					<FileRow {document} />
				{/if}
			{/each}
		</TableBody>
	</Table>
	</div>
</main>

<style>
	main {
			margin-top: 4em;
	}
	.table {
			margin-top: 3em;
			width: 100%;
	}
</style>
