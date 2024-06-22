import { test, expect } from '@playwright/test';

test.describe('Navbar Component', () => {

	test('should have correct links in navbar', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com'); // Replace with your test user's email
		await page.fill('input#password', '01050105'); // Replace with your test user's password
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);

		const expectedLinks = [
			{ text: 'General', href: '/' },
			{ text: 'Photo', href: '/photo' },
			{ text: 'Audio', href: '/audio' },
			{ text: 'Video', href: '/video' },
			{ text: 'Library', href: '/document' },
			{ text: 'Text', href: '/text' },
			{ text: 'Logout', href: '/register' }
		];

		for (const link of expectedLinks) {
			const locator = page.locator(`a:has-text("${link.text}")`);
			await expect(locator).toBeVisible();
			await expect(locator).toHaveAttribute('href', link.href);
		}
	});

	test('should display the correct title in the navbar', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com'); // Replace with your test user's email
		await page.fill('input#password', '01050105'); // Replace with your test user's password
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);

		const title = page.locator('.title');
		await expect(title).toBeVisible();
		await expect(title).toHaveText('&FILE');
	});

	test('should navigate to correct page on navbar link click', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com'); // Replace with your test user's email
		await page.fill('input#password', '01050105'); // Replace with your test user's password
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);

		const expectedLinks = [
			{ text: 'General', href: '/' },
			{ text: 'Photo', href: '/photo' },
			{ text: 'Audio', href: '/audio' },
			{ text: 'Video', href: '/video' },
			{ text: 'Library', href: '/document' },
			{ text: 'Text', href: '/text' },
			{ text: 'Logout', href: '/register' }
		];

		for (const link of expectedLinks) {
			const locator = page.locator(`a:has-text("${link.text}")`);
			await page.waitForTimeout(3000);
			await expect(locator).toBeVisible();
			await expect(locator).toHaveAttribute('href', link.href);
		}
	});

	test('should logout when clicking Logout', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com'); // Replace with your test user's email
		await page.fill('input#password', '01050105'); // Replace with your test user's password
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);

		await page.click('a:has-text("Logout")');
		await page.waitForTimeout(2000); // wait for logout process to complete
		await expect(page).toHaveURL('http://localhost:5173/');
	});
});
