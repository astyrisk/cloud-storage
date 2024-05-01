<script>
	import { Navbar, NavBrand, NavLi, NavUl, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHeadCell,TableHead, Gallery } from 'flowbite-svelte';
  import FolderRow from '../../components/home/FolderRow.svelte';
  import { getFirestore, collection, getDocs, doc, addDoc } from 'firebase/firestore';
  import { getApp } from 'firebase/app';
  import { getAuth} from 'firebase/auth';


  let images = [];

  const app = getApp();
  const auth = getAuth();
  const db = getFirestore(app);

  let galleryData = [];
  let currentGalleryDoc = null;

  const user = auth.currentUser;

  const userDocRef = doc(db, "Users", user.uid);

  const galleryCollectionRef = collection(userDocRef, "gallery");

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

  function handleNewGallery() {
      let galleryName = prompt("Please enter your gallery name:");
      if (galleryName == null) {
          return;
      }
      let currentDate = new Date();
      addGallery(galleryName, currentDate);
      updateData();
  }

  function goToGallery(name) {
      getCollectionDocs(galleryCollectionRef)
        .then(documents => documents.filter(doc => doc.data().name === name))
        .then(filteredDocs => {
            currentGalleryDoc = filteredDocs[0].ref;
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
              images = data.map(doc => ({
                  alt: doc.name,
                  src: doc.url
              }));
          });
      }
  }

  async function handleFileChange(event) {
      const file = event.target.files[0];

      if (!file.type.startsWith('image/')) {
          alert("you are only allowed to upload a picture!");
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

    {#if currentGalleryDoc == null}
    <div class="gallery">
        <Button color="light" on:click={handleNewGallery}>New Gallery</Button>
        <div class="table">
            <Table >
                <TableHead>
                    <TableHeadCell>Gallery</TableHeadCell>
                </TableHead>
                <TableBody tableBodyClass="divide-y">
                    {#each galleryData as gal}
                        <div class="row">
                            <TableBodyRow on:click={handleGalleryClick}>
                                <TableBodyCell >{gal.name}</TableBodyCell>
                                <TableBodyCell>{gal.date.toDate().toLocaleDateString()}</TableBodyCell>
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

        <div style="margin-top: 3em; width: 100%;">
            <Gallery items={images} class="gap-4 grid-cols-2 md:grid-cols-3" />
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

</style>
