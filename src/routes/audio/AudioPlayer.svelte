<script>
	import { Howl } from 'howler';
	import { onMount, onDestroy } from 'svelte';

	export let src;
	let audio = new Howl({
		src: "https://storage.googleapis.com/file-4cacd.appspot.com/uploads/1715545677584_Pink%20Floyd%20-%2001%20-%20Shine%20On%20You%20Crazy%20Diamond%20%28Part%20One%29.mp3?GoogleAccessId=firebase-adminsdk-7d5di%40file-4cacd.iam.gserviceaccount.com&Expires=16730319600&Signature=UX%2Bz0sQz9vKA8NjjiEfCSn6xlb1LSLKiKtbLOleVFQ70s0I1Znf1IKOZEJM1%2B3BDKBTyTqcW53lJ3ISin5gZ%2B4p0ZtDPluIcql6f0v71FdbcQlQTn0xIjiezciiLvL%2FjOufIAY9QZnMPRA6fCf1wYq0mZGbXY%2FnZj8DxrIqAx5pX74EgRhfT3lQs0Gt9gph4iObXkD7e3rGRSfyaYFwRqRBcqkwLjZYnekrGEBmgwQT1WapAORA3bnaGHkaiDaw%2Fzo%2Bl%2BqPnNSZPfwYB6AYoJmbMfjo892TpLI6kNMq3IkvgMfRanyA5pHeLqaV4i5h4vmOJlfkLKOnYpkuVW8Dd3Q%3D%3D"
	});

	let progress = 0;

	function playAudio() {
		audio.play();
	}

	function stopAudio() {
		audio.stop();
	}

	// Update progress as the audio plays
	function updateProgress() {
		const seek = audio.seek() || 0;
		progress = (seek / audio.duration()) * 100;
		requestAnimationFrame(updateProgress);
	}

	// Start updating the progress when the component is mounted
	onMount(() => {
		requestAnimationFrame(updateProgress);
	});

	// Clean up when the component is destroyed
	onDestroy(() => {
		audio.stop();
	});
</script>

<style>
    .progress-bar {
        width: 100%;
        background-color: #ddd;
    }

    .progress {
        height: 20px;
        background-color: #4CAF50;
        width: 0%;
    }
</style>

<div>
	<button on:click={playAudio}>Play</button>
	<button on:click={stopAudio}>Stop</button>
	<div class="progress-bar">
		<div class="progress" style="width: {progress}%"></div>
	</div>
</div>