<script>
	import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
</script>
<Navbar>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">&FILE</span>
	</NavBrand>
	<NavUl >
		<NavLi href="/">Home</NavLi>
		<NavLi href="/login">Login</NavLi>
		<NavLi href="/register">Register</NavLi>
		<NavLi href="/">Pricing</NavLi>
		<NavLi href="/">About</NavLi>
	</NavUl>
</Navbar>

<div style="margin-top: 6em;">
	<p class="text-2xl dark:text-white">&FILE is here to help you store and organize your files effortlessly!  </p>
	<p> <a href="/login"> Do you have an account? </a> <a href="/register"> Nope? </a> </p>
	<img src="dude.png" width="600" alt="dude" />
</div>

<style>
    p { margin-top: 4em; }
    img {
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>