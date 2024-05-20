<script>
    import { checkUserLoggedIn, logout } from '$lib/auth.js';
    import {onMount} from 'svelte';
    import Audio from './Audio.svelte';
    import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';

    let user = null;
    let mounted = false;

    onMount(async () => {
        user = await checkUserLoggedIn();
        mounted = true;
    });
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
            <NavLi href="/register" on:click={logout}>Logout</NavLi>
        </NavUl>
    </Navbar>
    {#if mounted && user}
        <Audio />
    {/if}
</main>


<style>
    main{
        max-width: 70%;
        margin: 3em auto;
    }
</style>