<script>
	import { logout } from '$lib/auth.js';
	import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
</script>

<Navbar  >

	<NavBrand href="/">
			<div class="title">
				&FILE
			</div>
	</NavBrand>
	<NavUl >
		<NavLi href="/">General</NavLi>
		<NavLi href="/photo">Photo</NavLi>
		<NavLi href="/audio">Audio</NavLi>
		<NavLi href="/video">Video</NavLi>
		<NavLi href="/document">Library</NavLi>
		<NavLi href="/text">Text</NavLi>
		<NavLi href="/register" on:click={logout}>Logout</NavLi>
	</NavUl>
</Navbar>

<style>
	.title {
			font-size: 2.3em;
			font-weight: bold;
	}
</style>