<script>
	import { checkUserLoggedIn, logout } from '$lib/auth.js';
	import {onMount} from 'svelte';
	import { getApp } from 'firebase/app';
	import Gallery from './Gallery.svelte';
	import Nav from '../../components/Nav.svelte';

	let user = null;
	let mounted = false;
	const app = getApp();

	onMount(async () => {
		user = await checkUserLoggedIn();
		mounted = true;
	});
</script>

<main>

	<Nav />

	{#if mounted && user}
		<Gallery />
	{/if}
</main>


<style>
    main{
        max-width: 70%;
        margin: 3em auto;
    }
</style>
