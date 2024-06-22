
<script>
	// Import markdown conversion library
	import { marked } from 'marked'
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { getStorage, ref, deleteObject, uploadString, getDownloadURL } from "firebase/storage";
	import { updateDoc } from "firebase/firestore";
	import { getApp } from 'firebase/app';
	import { getAuth } from 'firebase/auth';  // Adjust the import to your firebase configuration file

	// Define the prop for URL

	const app = getApp();
	const auth = getAuth();

	export let doc;

	// let userDocRef = doc(db, "Users", user.uid);
	// let galleryCollectionRef = collection(userDocRef, "text");

	// Declare a variable to store the markdown data
	let markdown = "";

	// Function to fetch markdown content from the URL
	async function fetchMarkdown() {
		try {
			const response = await fetch(doc.data().url);
			const data = await response.text();
			markdown = data;
		} catch (error) {
			console.error("Error fetching markdown:", error);
			markdown = "Failed to fetch markdown content.";
		}
	}

	// Fetch the markdown content when the component is mounted
	onMount(() => {
		if (doc) {
			fetchMarkdown();
		}
	});

	async function handleSaveClick() {
		const storage = getStorage();
		const oldUrl = doc.data().url;
		const oldFileRef = ref(storage, oldUrl);

		try {
			// Step 1: Delete the old document from Firebase Storage
			await deleteObject(oldFileRef);
			console.log('Old document deleted successfully.');

			// Step 2: Upload the new document to Firebase Storage
			const newFileRef = ref(storage, `documents/${doc.id}.md`);
			await uploadString(newFileRef, markdown);
			const newUrl = await getDownloadURL(newFileRef);
			console.log('New document uploaded successfully. URL:', newUrl);

			// Step 3: Update the Firestore document reference with the new URL
			// const docRef = firestoreDoc(db, 'your-collection-name', doc.id);  // Adjust 'your-collection-name' to your actual collection name
			await updateDoc(doc.ref, { url: newUrl });
			console.log('Firestore document updated successfully.');

		} catch (error) {
			console.error("Error saving document:", error);
		}
	}

</script>


<h1>Markdown Editor</h1>

<div class="container">
	<!-- Declare a textarea where the user can enter markdown, and bind it to the variable `markdown` -->
	<textarea bind:value={markdown} placeholder="Enter markdown here"></textarea>

	<!-- Convert the markdown to HTML and display it -->
	<div class="preview">{@html marked(markdown)}</div>
</div>

<div style="margin-top: 2em; display: inline-block;">
	<Button color="light" on:click={handleSaveClick}> save! </Button>
</div>

<!-- Make it look (slightly) nicer ;) -->
<style>
    .container {
        display: flex;
        height: 54vh; /* Adjust height as needed */
    }
    textarea, .preview {
        box-sizing: border-box;
        width: 50%; /* Adjust width if necessary */
    }
    textarea {
        font-family: monospace, Roboto;
        border: none;
        padding: 1rem;
        resize: none; /* Prevents manual resizing */
    }
    .preview {
        padding: 2rem;
        border-left: solid 2px #888; /* Changed to border-left to separate the columns */
        overflow-y: auto; /* Adds vertical scroll if content overflows */
    }

    h1 {
        background: #e1e1e1;
        margin: 0;
        padding: 0.8rem;
        font-size: 1.2rem;
    }

    h1, h2, h3 {
        color: #333;
        font-family: Arial, sans-serif;
        margin-top: 0;
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
				color: blue;
    }

    h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
    }

    :global(body) {
        padding: 0;
    }
</style>
