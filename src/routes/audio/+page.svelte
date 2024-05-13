<script>


	import { Navbar, NavBrand, NavLi, NavUl, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHeadCell,TableHead, Gallery } from 'flowbite-svelte';
  import FolderRow from '../../components/home/FolderRow.svelte';
  import { getFirestore, collection, getDocs, doc, addDoc } from 'firebase/firestore';
  import { getApp } from 'firebase/app';
  import { getAuth} from 'firebase/auth';
  import {Howl} from 'howler';
  import {onMount} from 'svelte';
  import Audio from './Audio.svelte';


  onMount(() => {
      sound = new Howl({
          src: "https://storage.googleapis.com/file-4cacd.appspot.com/uploads/1715545677584_Pink%20Floyd%20-%2001%20-%20Shine%20On%20You%20Crazy%20Diamond%20%28Part%20One%29.mp3?GoogleAccessId=firebase-adminsdk-7d5di%40file-4cacd.iam.gserviceaccount.com&Expires=16730319600&Signature=UX%2Bz0sQz9vKA8NjjiEfCSn6xlb1LSLKiKtbLOleVFQ70s0I1Znf1IKOZEJM1%2B3BDKBTyTqcW53lJ3ISin5gZ%2B4p0ZtDPluIcql6f0v71FdbcQlQTn0xIjiezciiLvL%2FjOufIAY9QZnMPRA6fCf1wYq0mZGbXY%2FnZj8DxrIqAx5pX74EgRhfT3lQs0Gt9gph4iObXkD7e3rGRSfyaYFwRqRBcqkwLjZYnekrGEBmgwQT1WapAORA3bnaGHkaiDaw%2Fzo%2Bl%2BqPnNSZPfwYB6AYoJmbMfjo892TpLI6kNMq3IkvgMfRanyA5pHeLqaV4i5h4vmOJlfkLKOnYpkuVW8Dd3Q%3D%3D"
      });

      console.log(sound);
  })

  let sound;
  let songs = [];

  const app = getApp();
  const auth = getAuth();
  const db = getFirestore(app);

  let artistsData = [];
  let currentArtistDoc = null;

  const user = auth.currentUser;

  const userDocRef = doc(db, "Users", user.uid);
  const musicCollectionRef = collection(userDocRef, "music");

  getCollectionDocsData(musicCollectionRef).then(x => artistsData = x);

  async function getCollectionDocsData(collectionRef) {
      const querySnapshot = await getDocs(collectionRef);
      return (querySnapshot.docs.map(x => x.data()));
  }

  async function getCollectionDocs(collectionRef) {
      const querySnapshot = await getDocs(collectionRef);
      return (querySnapshot.docs.map(x => x));
  }

  async function addArtist(name) {
      // Attempt to find the artist in the collection
      const docs = await getCollectionDocs(musicCollectionRef);
      const selectedDoc = docs.find(a => a.data().name === name);

      // If found, return the existing document
      if (selectedDoc) {
          // console.log(selectedDoc);
          return selectedDoc.ref;
      }

      // If not found, add a new document
      try {
          const artist = await addDoc(musicCollectionRef, { name });
          console.log(artist);
          return artist;
      } catch (error) {
          console.error("Failed to add artist:", error);
          throw error; // Rethrow the error if needed
      }
  }

  function goToArtist(name) {
      getCollectionDocs(musicCollectionRef)
        .then(documents => documents.filter(doc => doc.data().name === name))
        .then(filteredDocs => {
            currentArtistDoc = filteredDocs[0];
            // console.log(filteredDocs[0].data().name);
            updateData();
        });
  }

  function handleArtistClick(e) {
      goToArtist(Array.from(e.target.parentNode.children)[0].innerHTML);
  }

  function updateData() {
      if (currentArtistDoc == null) {
          getCollectionDocsData(musicCollectionRef).then(x => artistsData = x);
      } else {
          let songsCollection = collection(currentArtistDoc.ref, "songs");
          getCollectionDocsData(songsCollection).then(data => {
              songs = data.map(doc => ({
                  name: doc.name,
                  src: doc.url
              }));
          });

          //NOTE not good
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
              const [localData, firebaseData] = await Promise.all([
                  uploadLocally(formData),
                  uploadToFirebase(formData)
              ]);

              // console.log('Local Data:', localData["metadata"][0]);
              console.log('Artist:', localData["metadata"][0]["Artist"]);
              console.log('Album:', localData["metadata"][0]["Album"]);
              // console.log('Firebase Data:', firebaseData.url[0]);

              let artist = localData["metadata"][0]["Artist"];
              let album = localData["metadata"][0]["Album"];

              if (artist == undefined) {
                  artist = prompt("Enter artist name!");
              }
              if (album == undefined) {
                  artist = prompt("Enter album name!");
              }

              if (file) {
                  const selectedFile = {
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      date: file.lastModifiedDate,
                      isFile: true,
                      artist: artist,
                      album: album,
                      url: firebaseData.url[0]
                  };

                  let artistDocumentRef = null;
                  addArtist(artist).then(x => {

                      console.log(x);

                      addDoc(collection(x, "songs"), selectedFile);

                      // console.log(x);
                      // artistDocumentRef = x
                      // if (artistDocumentRef != null) {
                      //     addDoc(collection(artistDocumentRef, "songs"), selectedFile);
                      // }
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

  function handleNewFile() {
      document.getElementById('fileInput').click();
  }

  function handleSongClick () {
      // console.log(sound);
      sound.play();
  }

  function handleGoBack(){
      currentArtistDoc= null;
      updateData();
  }

  updateData();

</script>

<main>
    <input type="file" id="fileInput" style="display: none;" on:change={handleFileChange} />

    <Navbar  >
        <NavBrand href="/">
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">&FILE</span>
        </NavBrand>
        <NavUl >
            <NavLi href="/photo">Photo</NavLi>
            <NavLi href="/audio">Audio</NavLi>
            <NavLi href="/video">Video</NavLi>
            <NavLi href="/text">Text</NavLi>
            <NavLi href="/">Profile</NavLi>
            <NavLi href="/register" >Logout</NavLi>
        </NavUl>
    </Navbar>

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
                    <div style="cursor: pointer" on:click={handleSongClick}>
                        <TableBodyRow >
                            <TableBodyCell>{song.name}</TableBodyCell>
                            <!--                        <TableBodyCell >{song.url}</TableBodyCell>-->
                        </TableBodyRow>
                    </div>
                {/each}
            </TableBody>
        </Table>

        <div class="audio">
            <Audio />
        </div>
    {/if}
</main>

<style>
	main{
			max-width: 70%;
			margin: 3em auto;
	}
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
      position: absolute;
      bottom: 0;
      margin-bottom: 5em;
      display: flex;
      justify-content: center;
      align-items: center;
  }

</style>
