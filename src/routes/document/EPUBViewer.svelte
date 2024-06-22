
<script>
	import { onMount } from 'svelte';
	import ePub from 'epubjs';

	export let epubUrl;

	let book, rendition;

	onMount(async () => {
		try {
			console.log(epubUrl);
			book = ePub(epubUrl.src);

			rendition = book.renderTo("viewer", {
				width: "100%",
				height: "100%",
				flow: "paginated",
				spread: "none"
			});
			rendition.display();
			console.log(book);
		} catch (error) {
			console.error('Error loading EPUB:', error);
		}

		return () => {
			if (rendition) {
				rendition.destroy();
			}
		};
	});
	function nextPage() {
		rendition.next();
	}

	function prevPage() {
		rendition.prev();
	}
</script>

<style>
    #viewer {
        width: 100%;
        height: 100vh;
        border: 1px solid #ccc;
    }
</style>

<div id="viewer"></div>
<button on:click={prevPage}>Page Up</button>
<button on:click={nextPage}>Page Down</button>

