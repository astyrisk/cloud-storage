import { test, expect } from '@playwright/test';

test.describe('Login Route', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the login page before each test
		await page.goto('http://localhost:5173/login');
	});

	test('should render the login form', async ({ page }) => {
		// Check if all input fields and the button are present
		await expect(page.locator('input#email')).toBeVisible();
		await expect(page.locator('input#password')).toBeVisible();
		await expect(page.locator('button[type=submit]')).toBeVisible();
	});

	test('should log in a user', async ({ page }) => {
		// Fill in the login form
		await page.fill('input#email', 'john.doe@example.com');
		await page.fill('input#password', 'password123');

		// Submit the form
		await page.click('button[type=submit]');

		// Expect some outcome, e.g., a successful login message or redirect
		// This part needs to be adapted to your app's specific behavior upon successful login
		// For example, if it redirects to a dashboard, you can check for the dashboard content
		// await expect(page.locator('h1')).toHaveText('Dashboard');
	});
});
