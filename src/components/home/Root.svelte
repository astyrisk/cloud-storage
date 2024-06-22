<script>
	// https://www.npmjs.com/package/exiftool
	import { getApp } from 'firebase/app';
	import { getAuth} from 'firebase/auth';
	import { collection, doc, addDoc, setDoc, getDocs, getFirestore } from 'firebase/firestore';
	import { updateData, getDirDocsData } from '$lib/db.js';
	import { rootDir, currentDir, currentElementsData } from '$lib/store.js';
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import FolderRow from './FolderRow.svelte';
	import FileRow from './FileRow.svelte';
	import HeaderRow from './HeaderRow.svelte';

	const app = getApp();
	const auth = getAuth();
	const db = getFirestore(app);

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
				// Step 1: Upload locally
				const localData = await uploadLocally(formData);
				console.log('Local Data:', localData);

				const currentDocs = await getDirDocsData($currentDir);

				if (currentDocs.some(x => x.fileHash === localData.fileHash)){
					alert("this file is already uploaded!");
					return;
				}

				if (currentDocs.some(x => x.name === file.name)){
					alert("file name already exists!");
					return;
				}

				// Step 2: If local upload is successful, upload to Firebase
				const firebaseData = await uploadToFirebase(formData);
				console.log('Firebase Data:', firebaseData.url[0]);

				// Check if file is defined
				if (file) {
					const selectedFile = {
						name: file.name,
						size: file.size,
						type: file.type,
						date: file.lastModified,
						isFile: true,
						fileHash: localData.fileHash,
						url: firebaseData["url"]
					};

					console.log(selectedFile);
					console.log(file);

					// Add document to current directory and update data
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

	function handleNewFolder() {
		let name = prompt("new folder name: ");

		if (name == null) {
			return;
		}

		if (name.indexOf('.')!== -1) {
			alert("dots are not allowed in folders names");
			return;
		}

		getDirDocsData($currentDir).then( x => {
				const isDuplicate = x.some(obj => obj.name === name);
				if (isDuplicate) {
					alert("folder is already created!");
					return;
				}
				addDoc($currentDir, {
					name: name,
					isFile: false
				})
				updateData();
			}
		)

	}
</script>

<input type="file" id="fileInput" style="display: none;" on:change={handleFileChange} />
<main>
	<ButtonGroup>
		<Button on:click={() => document.getElementById('fileInput').click()}>New File</Button>
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
