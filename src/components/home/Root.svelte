<script>
	// https://www.npmjs.com/package/exiftool
	import { getApp } from 'firebase/app';
	import { getAuth} from 'firebase/auth';
	import { collection, doc, addDoc, setDoc, getDocs, getFirestore } from 'firebase/firestore/lite';
	import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";

	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import FolderRow from './FolderRow.svelte';
	import FileRow from './FileRow.svelte';
	import HeaderRow from './HeaderRow.svelte';

	const app = getApp();
	const auth = getAuth();
	const db = getFirestore(app);
	const storage = getStorage();
	const storageRef = ref(storage);

	//TODO move to stores
	let currentDirectoryElements = [];
	let currentDirectoryCollection = null; //collection
	let currentDirectoryDocument = "root"; //document
	let currentDirectoryDocumentData = null; //document
	let selectedFile = null;
	let isRoot = true;

	const user = auth.currentUser;
	const userDocRef = doc(db, "Users", user.uid);
	const root = collection(userDocRef, "root"); // root collection
	currentDirectoryCollection = root;

	async function listDocsData(collectionRef) {
		const querySnapshot = await getDocs(collectionRef);
		return querySnapshot.docs.map(doc => doc.data());
	}

	async function listDocs(collectionRef) {
		const querySnapshot = await getDocs(collectionRef);
		return querySnapshot.docs.map(doc => doc);
	}

	listDocsData(currentDirectoryCollection).then(x => currentDirectoryElements= x);

	function changeDir(e) {
		let folder_name;

		if (e.target.tagName == "P") {
			folder_name = e.target.parentElement.parentElement.children[0].innerText;
		} else {
			folder_name = e.target.parentElement.children[0].innerText;
		}

		listDocs(currentDirectoryCollection).then(x => x.forEach(x => {
			if (x.data().name == folder_name && ! x.data().isFile) {
				currentDirectoryCollection = collection(x.ref, "folder");
				currentDirectoryDocument = x.ref;
				currentDirectoryDocumentData = x.data();
				isRoot = false;
				listDocsData(currentDirectoryCollection).then(x => currentDirectoryElements= x);
			}
		}));
	}

	function downloadDoc() {
	}

	function handleFileChange(event) {
		const file = event.target.files[0];
		const storageRef = ref(storage, "images/" + file.name);
		uploadBytes(storageRef, file).then((snapshot) => {
			console.log('Uploaded a blob or file!');
		});

		if (file) {
			selectedFile = {
				name: file.name,
				size: (file.size / 1024).toFixed(2) + ' KB',
				type: file.type,
				isFile: true,
				ref: "images" + file.name
			};
			addDoc(currentDirectoryCollection, selectedFile);
			listDocsData(currentDirectoryCollection).then(x => currentDirectoryElements= x);
		}
	}


	function newFolder() {
		let name = prompt("new folder name: ");
		addDoc(currentDirectoryCollection, {
			name: name,
			isFile: false,
			parent: currentDirectoryDocument,
			parentData: currentDirectoryDocumentData
		});
		listDocsData(currentDirectoryCollection).then(x => currentDirectoryElements= x);
	}

	function goBack() {
		// console.log(currentDirectoryDocument.data());
		if (currentDirectoryDocumentData.parent == "root") {
			isRoot = true;
			currentDirectoryDocument = null;
			currentDirectoryCollection = root;
			listDocsData(currentDirectoryCollection).then(x => currentDirectoryElements= x);
		} else {
			currentDirectoryDocument = currentDirectoryDocumentData.parent;
			currentDirectoryDocumentData = currentDirectoryDocumentData.parentData;
			currentDirectoryCollection = collection(currentDirectoryDocument, "folder");
			listDocsData(currentDirectoryCollection).then(x => currentDirectoryElements= x);
		}
	}
	// getUsers(db).then(users => {
	// 	console.log(users);
	// });

	function handleNewFile() {
		let file = document.getElementById('fileInput').click();
	}

	function handleNewFolder() {
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
			<HeaderRow {isRoot} />
		<TableBody>
			{#if !isRoot}
				<TableBodyRow >
					<TableBodyCell style="cursor: pointer" on:click={goBack}>
						<p> .. </p>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
			{#each currentDirectoryElements as document}
				{#if !document.isFile}
					<FolderRow {document} />
				{/if}
			{/each}

			{#each currentDirectoryElements as document}
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
