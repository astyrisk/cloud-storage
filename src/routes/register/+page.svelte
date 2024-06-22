<script>
	/* Register Route */
	import { Input, Label, Button, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { createUser } from '$lib/auth.js';

	let emailInput;
	let nameInput;
	let passwordInput;

	onMount(() => {
		nameInput 		= document.getElementById("name");
		emailInput 		= document.getElementById("email");
		passwordInput = document.getElementById("password");
	});

	function handleRegistrationForm() {
		createUser(emailInput.value, nameInput.value, passwordInput.value);
	}

</script>

<main>

	<Navbar>
		<NavBrand href="/">
			<div class="title">
				&FILE
			</div>
		</NavBrand>
		<NavUl>
			<NavLi href="/login">Login</NavLi>
			<NavLi href="/register">Register</NavLi>
		</NavUl>
	</Navbar>

	<form>
		<div class="mb-6">
			<Label for="name" class="mb-2">Name</Label>
			<Input type="text" id="name" placeholder="John" required />
		</div>
		<div class="mb-6">
			<Label for="email" class="mb-2">Email address</Label>
			<Input type="email" id="email" placeholder="john.doe@company.com" required />
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">Password</Label>
			<Input type="password" id="password" placeholder="•••••••••" required />
		</div>
		<div class="mb-6">
			<Label for="confirm_password" class="mb-2">Confirm password</Label>
			<Input type="password" id="confirm_password" placeholder="•••••••••" required />
		</div>
		<Button type="submit" on:click={handleRegistrationForm}>Register</Button>
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
  .title {
      font-size: 2.3em;
      font-weight: bold;
  }
</style>