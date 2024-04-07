<script>
	/* Login Route */
	import { Input, Label, Button, Navbar, NavBrand, NavLi, NavUl  } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { loginUser} from '$lib/auth.js';

	let emailInput;
	let passwordInput;

	onMount(() => {
		emailInput = document.getElementById("email");
		passwordInput = document.getElementById("password");
	});

	function handleLoginForm() {
		loginUser(emailInput.value, passwordInput.value)
	}
</script>

<main>
	<Navbar  >
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">&FILE</span>
		</NavBrand>
		<NavUl >
			<NavLi href="/">Home</NavLi>
			<NavLi href="/login">Login</NavLi>
			<NavLi href="/register">Register</NavLi>
			<NavLi href="/">Pricing</NavLi>
			<NavLi href="/about">About</NavLi>
		</NavUl>
	</Navbar>

	<form>
		<div class="mb-6">
			<Label for="email" class="mb-2">Email address</Label>
			<Input type="email" id="email" placeholder="john.doe@company.com" required />
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">Password</Label>
			<Input type="password" id="password" placeholder="•••••••••" required />
		</div>
		<Button type="submit" on:click={handleLoginForm}>Login</Button>
	</form>
</main>

<style>
    main, form {
        margin: 3em auto;
    }
		main {
				max-width: 70%
		}
		form {
				max-width: 50%;
		}
</style>
