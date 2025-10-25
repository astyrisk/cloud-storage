<script>
	import { Navbar, NavBrand, NavLi, NavUl, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHeadCell,TableHead, Gallery } from 'flowbite-svelte';
	import { getFirestore, collection, getDocs, doc, addDoc } from 'firebase/firestore';
	import { getApp } from 'firebase/app';
	import { getAuth} from 'firebase/auth';
	import { getDirDocsData, getDirDocs } from '$lib/db.js'
	import {Howl} from 'howler';
	import {onMount} from 'svelte';
	import AudioPlayer from './AudioPlayer.svelte';

	let songs = [];

	const app = getApp();
	const auth = getAuth();
	const db = getFirestore(app);

	let artistsData = [];
	let currentArtistDoc = null;

	let currentSong = null;

	const user = auth.currentUser;

	const userDocRef = doc(db, "Users", user.uid);
	const musicCollectionRef = collection(userDocRef, "music");

	onMount(async () => {
		artistsData = await getDirDocsData(musicCollectionRef);
	})

	// getDirDocsData(musicCollectionRef).then(x => artistsData = x);

	// async function getCollectionDocsData(collectionRef) {
	// 	const querySnapshot = await getDocs(collectionRef);
	// 	return (querySnapshot.docs.map(x => x.data()));
	// }
	//
	// async function getCollectionDocs(collectionRef) {
	// 	const querySnapshot = await getDocs(collectionRef);
	// 	return (querySnapshot.docs.map(x => x));
	// }

	/* takes an artist name and checks if it's already added */
	async function addArtist(name) {
		const docs = await getDirDocs(musicCollectionRef);
		console.log(docs);

		const selectedDoc = docs.find(a => a.data().name === name);

		if (selectedDoc) {
			return selectedDoc.ref;
		}

		try {
			const artist = await addDoc(musicCollectionRef, { name });
			return artist;
		} catch (error) {
			console.error("Failed to add artist:", error);
			throw error;
		}
	}

	async function goToArtist(name) {
		let artistsDocs = await getDirDocs(musicCollectionRef);
		currentArtistDoc = artistsDocs.find(a => decodeHtmlString(a.data().name) === decodeHtmlString(name));
		updateData();
	}

	async function updateData() {
		if (currentArtistDoc == null) {
			getDirDocsData(musicCollectionRef).then(x => artistsData = x);
		} else {
			const songsData = await getDirDocsData(collection(currentArtistDoc.ref, "songs"));

			//TODO rewrite songs array
			songs = songsData.map(doc => ({
				name: doc.name,
				src: doc.url
			}));
		}
	}

	async function handleFileChange(event) {
		const file = event.target.files[0];

		if (!file.type.startsWith('audio/')) {
			alert("You are only allowed to upload an audio file!");
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
				const localData = await  uploadLocally(formData);

				let artist = localData["metadata"][0]["Artist"];
				let album = localData["metadata"][0]["Album"];

				if (artist === undefined) {
					artist = prompt("Enter artist name!");
				}
				if (album === undefined) {
					album = prompt("Enter album name!");
				}

				console.log(artist);

				// let artistsDocs = await  getDirDocs(musicCollectionRef);
				// let selectedArtistDoc = artistsDocs.find(a => a.data().name === artist);

				let selectedArtistDoc = await addArtist(artist);
				const selectedAristSongs = await getDirDocsData(collection(selectedArtistDoc, "songs"));

				if (selectedAristSongs.some(x => x.fileHash === localData.fileHash)){
					alert("this song is already uploaded!");
					return;
				}

				if (selectedAristSongs.some(x => x.name === file.name)){
					alert("file name already exists!");
					return;
				}

				const firebaseData = await  uploadToFirebase(formData);

				// console.log('Local Data:', localData["metadata"][0]);
				// console.log('Artist:', localData["metadata"][0]["Artist"]);
				// console.log('Album:', localData["metadata"][0]["Album"]);
				// console.log('Firebase Data:', firebaseData.url[0]);

				if (file) {
					const selectedFile = {
						name: file.name,
						size: file.size,
						type: file.type,
						date: file.lastModified,
						isFile: true,
						artist: artist,
						album: album,
						fileHash: localData.fileHash,
						url: firebaseData["url"]
					};

					addArtist(artist).then(x => {
						addDoc(collection(x, "songs"), selectedFile);
						updateData();
					});
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

	function decodeHtmlString(htmlString) {
		let tempElement = document.createElement('div');
		tempElement.innerHTML = htmlString;
		return tempElement.textContent || tempElement.innerText;
	}

	function handleArtistClick(e) {
		goToArtist(Array.from(e.target.parentNode.children)[0].innerHTML);
	}

	function handleNewFile() {
		document.getElementById('fileInput').click();
	}

	function handleSongClick (song) {

		currentSong = null;
		setTimeout(() => {
			currentSong = song;
		}, 0);
	}

	function handleGoBack(){
		currentArtistDoc= null;
		updateData();
	}
	updateData();
</script>

<main>
	<input type="file" id="fileInput" style="display: none;" on:change={handleFileChange} />

	{#if currentArtistDoc == null}
		<div class="gallery">
			<Button color="light" on:click={handleNewFile}>upload</Button>
			<div class="table">
				<Table >
					<TableHead>
						<TableHeadCell>Artists</TableHeadCell>
					</TableHead>
					<TableBody tableBodyClass="divide-y">
						{#each artistsData as artist}
							<div class="row">
								<TableBodyRow on:click={handleArtistClick}>
									<TableBodyCell >{artist.name}</TableBodyCell>
								</TableBodyRow>
							</div>
						{/each}
					</TableBody>
				</Table>
			</div>
		</div>
	{:else}
		<div style="margin-top: 4em">
			<Button color="light" on:click={handleGoBack}>go back</Button>
		</div>
		<div style="margin-top: 3em"></div>
		<Table >
			<TableHead>
				<TableHeadCell>{currentArtistDoc.data().name}</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each songs as song }
					<div style="cursor: pointer" on:click={() => handleSongClick(song.src)}>
						<TableBodyRow >
							<TableBodyCell>{song.name}</TableBodyCell>
							<!--                        <TableBodyCell >{song.url}</TableBodyCell>-->
						</TableBodyRow>
					</div>
				{/each}
			</TableBody>
		</Table>
		<div class="audio">
<!--			<AudioPlayer src={currentSong} />-->
			{#if currentSong}
				<AudioPlayer src={currentSong} />
			{/if}
		</div>
	{/if}
</main>

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
    .audio {
        width: 70%;
        position: absolute;
        bottom: 0;
        margin-bottom: 5em;
    }
</style>
