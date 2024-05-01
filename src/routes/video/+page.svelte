<script>
	import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
</script>


<main>
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
            <NavLi href="/register" >Logout</NavLi>
        </NavUl>
    </Navbar>
</main>

<style>
	main{
			max-width: 70%;
			margin: 3em auto;
	}
</style>
