<script>
	import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
	import Root from './Root.svelte';
	export let logout;
</script>
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
		<NavLi href="/register" on:click={logout}>Logout</NavLi>
	</NavUl>
</Navbar>

<Root />
