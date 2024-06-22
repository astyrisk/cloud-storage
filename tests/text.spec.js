import { test, expect } from '@playwright/test';

test.describe('Text Component', () => {

	test('login and redirect to text page', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForSelector('button:has-text("save!")');
		await page.goto('http://localhost:5173/text');
		await page.waitForTimeout(3000);
		await expect(page).toHaveURL('http://localhost:5173/text');
	});

	test('save button visibility', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/text');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("save!")')).toBeVisible();
	});

	test('should handle markdown input and save', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/text');
		await page.waitForTimeout(3000);

		const markdownContent = '# Test Header\n\nThis is a test paragraph.';
		await page.fill('textarea', markdownContent);
		await page.click('button:has-text("save!")');
		await page.waitForTimeout(3000);

		// Verify that the markdown content was saved and rendered correctly
		await expect(page.locator('h1:has-text("Test Header")')).toBeVisible();
		await expect(page.locator('text=This is a test paragraph.')).toBeVisible();
	});

	test('should display fetched markdown content', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/text');
		await page.waitForTimeout(3000);

		// Assuming there is already some markdown content fetched from the provided URL
		await page.waitForSelector('.preview');
		await expect(page.locator('.preview')).toContainText('#');
		await expect(page.locator('.preview')).toContainText('This is a test paragraph.');
	});

	test('edit and save existing markdown content', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/text');
		await page.waitForTimeout(3000);

		// Edit the markdown content
		await page.fill('textarea', '');
		const newMarkdownContent = '# Updated Header\n\nThis is an updated test paragraph.';
		await page.fill('textarea', newMarkdownContent);
		await page.click('button:has-text("save!")');
		await page.waitForTimeout(3000);

		// Verify that the new markdown content was saved and rendered correctly
		await expect(page.locator('h1:has-text("Updated Header")')).toBeVisible();
		await expect(page.locator('text=This is an updated test paragraph.')).toBeVisible();
	});
});
