<script>
	// https://www.npmjs.com/package/exiftool
	import { getApp } from 'firebase/app';
	import { getAuth} from 'firebase/auth';
	import { collection, doc, addDoc, setDoc, getDocs, getFirestore } from 'firebase/firestore';
	import { updateData } from '$lib/db.js';
	import { rootDir, currentDir, currentElementsData } from '$lib/store.js';
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

	currentDir.set(collection(userDocRef, "root"));
	rootDir.set(collection(userDocRef, "root"));
	updateData();

	async function handleFileChange(event) {
		const file = event.target.files[0];

		const uploadToServer = async (url, formData) => {
			const response = await fetch(url, {
				method: 'POST',
				body: formData
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		};

		const uploadLocally = async (formData) => {
			return uploadToServer('http://localhost:3000/upload/local', formData);
		};

		const uploadToFirebase = async (formData) => {
			return uploadToServer('http://localhost:3000/upload/firebase', formData);
		};

		const handleFileUpload = async (formData) => {
			try {
				const [localData, firebaseData] = await Promise.all([
					uploadLocally(formData),
					uploadToFirebase(formData)
				]);

				console.log('Local Data:', localData);
				console.log('Firebase Data:', firebaseData.url[0]);

				if (file) {
					const selectedFile = {
						name: file.name,
						size: file.size,
						type: file.type,
						date: file.lastModifiedDate,
						isFile: true,
						url: firebaseData.url[0]
					};
					addDoc($currentDir, selectedFile);
					updateData();
				}
			} catch (error) {
				console.error('Error:', error);
				alert('An error occurred while uploading the file');
			}
		};

		const formData = new FormData();
		formData.append('file', file);

		handleFileUpload(formData);
	}

	function handleNewFile() {
		document.getElementById('fileInput').click();
	}

	function handleNewFolder() {
		let name = prompt("new folder name: ");
		if (name == null) {
			return;
		}
	  console.log(name);

		addDoc($currentDir, {
			name: name,
			isFile: false
		})
		updateData();
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
			<HeaderRow isRoot={($currentDir).id === "root"} />
			<TableBody>
			{#each $currentElementsData as document}
				{#if !document.isFile}
					<FolderRow {document} />
				{/if}
			{/each}

			{#each $currentElementsData as document}
				{#if document.isFile}
					<FileRow doc={document} />
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
