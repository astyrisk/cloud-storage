import { test, expect } from '@playwright/test';

test.describe('Registration Route', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173/register');
	});

	test('should render the registration form', async ({ page }) => {
		await expect(page.locator('input#name')).toBeVisible();
		await expect(page.locator('input#email')).toBeVisible();
		await expect(page.locator('input#password')).toBeVisible();
		await expect(page.locator('input#confirm_password')).toBeVisible();
		await expect(page.locator('button[type=submit]')).toBeVisible();
	});

	test('should register a new user', async ({ page }) => {
		await page.fill('input#name', 'John Doe');
		await page.fill('input#email', 'john.doe@example.com');
		await page.fill('input#password', 'password123');
		await page.fill('input#confirm_password', 'password123');
		await page.click('button[type=submit]');
	});
});
