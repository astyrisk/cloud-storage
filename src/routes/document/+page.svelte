<script>
	import { checkUserLoggedIn, logout } from '$lib/auth.js';
	import {onMount} from 'svelte';
	import Text from './Document.svelte';
	import Nav from '../../components/Nav.svelte';

	let user = null;
	let mounted = false;

	onMount(async () => {
		user = await checkUserLoggedIn();
		mounted = true;
	});
</script>

<main>
	<Nav />

	{#if mounted && user}
		<Text />
	{/if}
</main>

<style>
    main{
        max-width: 70%;
        margin: 3em auto;
    }
</style>