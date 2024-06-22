import { test, expect } from '@playwright/test';

test.describe('Root Component', () => {

	test('login', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForSelector('button:has-text("New File")');
	});

	test('redirect to homepage after login', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com'); // Replace with your test user's email
		await page.fill('input#password', '01050105'); // Replace with your test user's password
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await expect(page).toHaveURL('http://localhost:5173/');
	});

	test('new file and folder buttons', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com'); // Replace with your test user's email
		await page.fill('input#password', '01050105'); // Replace with your test user's password
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("New File")')).toBeVisible();
		await expect(page.locator('button:has-text("New Folder")')).toBeVisible();
	});

	test('should handle new folder creation', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com'); // Replace with your test user's email
		await page.fill('input#password', '01050105'); // Replace with your test user's password
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		page.on('dialog', async dialog => {
			expect(dialog.type()).toBe('prompt');
			await dialog.accept('New Folder Name');
		});
		await page.click('button:has-text("New Folder")');
		await expect(page.locator('text=New Folder Name')).toBeVisible();
	});

	test('should handle file upload', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com'); // Replace with your test user's email
		await page.fill('input#password', '01050105'); // Replace with your test user's password
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);

		await page.waitForSelector('button:has-text("New File")');
		const [fileChooser] = await Promise.all([
			page.waitForEvent('filechooser'),
			page.click('button:has-text("New File")'), // Click triggers file chooser
		]);

		await fileChooser.setFiles('tests/sample.txt');
		await page.waitForTimeout(3000);
		await page.screenshot({ path: 'screenshots/file_upload_success.png' });
		await expect(page.locator('text=sample.txt')).toBeVisible();
	});
});

