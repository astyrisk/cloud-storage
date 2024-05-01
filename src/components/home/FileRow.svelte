<script>
	import { TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	// import { downloadFile } from '$lib/db.js';
	import {currentPath} from '$lib/store.js';

	export let doc;

	function downloadUrl(url, filename) {
		fetch(url)
			.then(response => response.blob())
			.then(blob => {
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			})
			.catch(error => {
				console.error('Error downloading URL:', error);
			});
	}

	function bytesToKilobytesOrMegabytes(fileSizeInBytes) {
		if (fileSizeInBytes < 1024) {
			return fileSizeInBytes + ' B';
		} else if (fileSizeInBytes < 1024 * 1024) {
			return (fileSizeInBytes / 1024).toFixed(2) + ' KB';
		} else {
			return (fileSizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
		}
	}

	function formatLastModifiedDate(lastModifiedTimestamp) {
		const milliseconds = lastModifiedTimestamp * 1000;
		const date = new Date(milliseconds);

		// console.log(date);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return `${year - 1969}-${month}-${day}`;
	}

	function downloadFile() {
		window.open(doc.url, '_blank');
	}
</script>

<TableBodyRow>
	<TableBodyCell>{doc.name}</TableBodyCell>
	<TableBodyCell on:click={downloadFile}>
		<p style="cursor: pointer"> Download </p>
	</TableBodyCell>
	<TableBodyCell>{doc.type}</TableBodyCell>
	<TableBodyCell>{bytesToKilobytesOrMegabytes(doc.size)}</TableBodyCell>
	<TableBodyCell>{formatLastModifiedDate(doc.date)}</TableBodyCell>
</TableBodyRow>
