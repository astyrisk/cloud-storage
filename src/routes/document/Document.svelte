<script>
	import {  Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHeadCell,TableHead, Gallery } from 'flowbite-svelte';
	import { getFirestore, collection, getDocs, doc, addDoc } from 'firebase/firestore';
	import { getApp } from 'firebase/app';
	import { getAuth} from 'firebase/auth';
	import { getDirDocsData, getDirDocs } from '$lib/db.js';
	import EPUBViewer from './EPUBViewer.svelte';

	let books = [];
	let isViewing = false;
	let currentDocument = null;

	const app = getApp();
	const auth = getAuth();
	const db = getFirestore(app);
	const user = auth.currentUser;

	let galleryData = [];
	let currentGalleryDoc = null;
	let currentGalleryName = "";

	let userDocRef = doc(db, "Users", user.uid);
	let galleryCollectionRef = collection(userDocRef, "library");

	async function getCollectionDocsData(collectionRef) {
		const querySnapshot = await getDocs(collectionRef);
		return (querySnapshot.docs.map(x => x.data()));
	}

	async function getCollectionDocs(collectionRef) {
		const querySnapshot = await getDocs(collectionRef);
		return (querySnapshot.docs.map(x => x));
	}

	async function addGallery(name, date) {
		addDoc(galleryCollectionRef, {
			name: name,
			date: date,
		});
	}

	async function handleNewGallery() {
		try {
			let galleryName = prompt("Please enter your gallery name:");
			if (galleryName === null || galleryName.trim() === "") {
				return;
			}
			if (galleryName.indexOf('.')!== -1) {
				alert("dots are not allowed in gallery names");
				return;
			}

			const currentGalls = await getDirDocsData(galleryCollectionRef);
			if (currentGalls.some(x => x.name === galleryName)) {
				alert("Gallery already exists!");
				return;
			}

			let currentDate = new Date();
			await addGallery(galleryName, currentDate);
			await updateData();
		} catch (error) {
			console.error("Error handling new gallery:", error);
			alert("An error occurred while creating the new gallery.");
		}
	}

	function goToGallery(name) {
		getCollectionDocs(galleryCollectionRef)
			.then(documents => documents.filter(doc => doc.data().name === name))
			.then(filteredDocs => {
				currentGalleryDoc = filteredDocs[0].ref;
				currentGalleryName = filteredDocs[0].data().name;
				updateData();
			});
	}

	function handleGalleryClick(e) {
		goToGallery(Array.from(e.target.parentNode.children)[0].innerHTML);
	}

	function updateData() {
		if (currentGalleryDoc == null) {
			getCollectionDocsData(galleryCollectionRef).then(x => galleryData = x);
		} else {
			let imagesCollection = collection(currentGalleryDoc, "images");
			getCollectionDocsData(imagesCollection).then(data => {
				books = data.map(doc => ({
					alt: doc.name,
					src: doc.url,
					author: doc.author,
					type: doc.documentType
				}));
			});
		}
	}

	async function handleFileChange(event) {
		const file = event.target.files[0];

		console.log(file.type);

		if (file.type.indexOf("pdf") === -1 && file.type.indexOf("epub") === -1) {
			alert("you are only allowed to upload a pdf or epub!");
			return;
		}

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
				// console.log('Local Data:', localData);

				const currentDocs = await getDirDocsData(collection(currentGalleryDoc, "images"));
				// console.log(currentDocs);

				if (currentDocs.some(x => x.fileHash === localData.fileHash)){
					alert("this picture is already uploaded!");
					return;
				}

				if (currentDocs.some(x => x.name === file.name)){
					alert("file name already exists!");
					return;
				}
				let creator = localData["metadata"][0]["Creator"];

				if (creator === undefined){
					creator = prompt("enter the name of the author");
				}

				if (creator === undefined || creator == ""){
					alert("author name shouldn't be empty")
					return;
				}
				// console.log("author is ", creator);

				// Step 2: If local upload is successful, upload to Firebase
				const firebaseData = await uploadToFirebase(formData);
				// console.log(firebaseData["url"]);
				// console.log('Firebase Data:', firebaseData.url[0]);
				// return;

				// Check if file is defined
				if (file) {
					const selectedFile = {
						name: file.name,
						size: file.size,
						type: file.type,
						date: file.lastModified,
						isFile: true,
						fileHash: localData.fileHash,
						url: firebaseData["url"],
						author: creator,
						documentType: file.type.indexOf("pdf") !== -1 ? "pdf" : "epub"
					};

					// Add document to current directory and update data
					addDoc(collection(currentGalleryDoc, "images"), selectedFile);
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

	function handleGoBack(){
		currentGalleryDoc = null;
		updateData();
	}

	function handleDocumentClick(src) {
		currentDocument = src;
		console.log(currentDocument);
		isViewing = true;
		// window.open(src);
	}

	updateData();
</script>

	<input type="file" id="fileInput" style="display: none;" on:change={handleFileChange} />

{#if isViewing}
<!--	<DocumentViewer document={currentDocument} documentType="pdf" />-->
	<div style="margin-top: 4em;"> </div>
	<Button color="light" on:click={() => { isViewing = false }} > go to library </Button>
	<div style="margin-top: 3em;"> </div>
	{#if currentDocument.type === "epub"}
	<EPUBViewer epubUrl={currentDocument}/>
		{:else}
		<embed src={currentDocument.src} type="application/pdf" width="100%" height="600px">
<!--	<PDFViewer url={currentDocument.src}/>-->
	{/if}

{:else}
	{#if currentGalleryDoc == null}
	<div class="gallery">
			<Button color="light" on:click={handleNewGallery}>New Library</Button>
			<div class="table">
					<Table >
							<TableHead>
									<TableHeadCell>Libraries</TableHeadCell>
							</TableHead>
							<TableBody tableBodyClass="divide-y">
									{#each galleryData as gal}
											<div class="row">
													<TableBodyRow on:click={handleGalleryClick}>
															<TableBodyCell >{gal.name}</TableBodyCell>
<!--                                <TableBodyCell>{gal.date.toDate().toLocaleDateString()}</TableBodyCell>-->
													</TableBodyRow>
											</div>
									{/each}
							</TableBody>
					</Table>
			</div>
	</div>
	{:else}

		<div style="margin-top: 4em">
				<Button color="light" on:click={handleNewFile}>upload</Button>
				<Button color="light" on:click={handleGoBack}>go back</Button>
		</div>
		<div class="table">
			<Table >
				<TableHead>
					<TableHeadCell> {currentGalleryName} </TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each books as img}
						<div class="row">
							<TableBodyRow on:click={() => handleDocumentClick(img)}>
								<div class="alt">
<!--									<TableBodyCell> <img src={img.thumbnailSrc} width="100px"></TableBodyCell>-->
									<TableBodyCell >{img.author}</TableBodyCell>
									<TableBodyCell >{img.alt}</TableBodyCell>
								</div>
								<!--									<TableBodyCell >{img.src} </TableBodyCell>-->
							</TableBodyRow>
						</div>
					{/each}
				</TableBody>
			</Table>
		</div>
	{/if}
{/if}

<style>
    .gallery {
        margin-top: 4em;
    }
    .table {
        margin-top: 3em;
        width: 100%;
    }
    .row {
        cursor: pointer;
    }
</style>
