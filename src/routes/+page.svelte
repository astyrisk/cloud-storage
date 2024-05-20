
<script>
	// TODO profile tab. the user's data should be stored in a dbs. he should be able to change any of its!.
	// TODO navbar to go through different tabs
	import { checkUserLoggedIn, logout } from '$lib/auth.js';
	import { onMount } from 'svelte';

	import Unlogged from '../components/home/Unlogged.svelte';
	import Logged from '../components/home/Logged.svelte';

	let user = null;
	let mounted = false;

	onMount(async () => {
		user = await checkUserLoggedIn();
		mounted = true;
	});

</script>

<main>
	{#if mounted}
		{#if user }
			<Logged logout={logout} />
		{:else  }
			<Unlogged />
		{/if}
	{/if}
</main>

<style>
	main{
			max-width: 70%;
			margin: 3em auto;
	}
</style>
