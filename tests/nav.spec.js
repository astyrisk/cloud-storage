import { test, expect } from '@playwright/test';

test.describe('Root Component', () => {

	test('should render the login form', async ({ page }) => {
		await expect(page.locator('input#email')).toBeVisible();
		await expect(page.locator('input#password')).toBeVisible();
		await expect(page.locator('button[type=submit]')).toBeVisible();
	});

	test('login', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		// Use waitForSelector to ensure the page has loaded and the element is visible
		await page.waitForSelector('button:has-text("New File")', { timeout: 5000 });
	});

	test('redirect to homepage after login', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		// Wait for page navigation instead of using timeout
		await page.waitForNavigation({ url: 'http://localhost:5173/' });
		await expect(page).toHaveURL('http://localhost:5173/');
	});

	test('new file and folder buttons', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		// Wait for button to be visible
		await page.waitForSelector('button:has-text("New File")', { timeout: 5000 });
		await page.waitForSelector('button:has-text("New Folder")', { timeout: 5000 });
		await expect(page.locator('button:has-text("New File")')).toBeVisible();
		await expect(page.locator('button:has-text("New Folder")')).toBeVisible();
	});

	test('should handle new folder creation', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForSelector('button:has-text("New Folder")', { timeout: 5000 });
		// Ensure dialog appears before accepting
		page.on('dialog', async dialog => {
			expect(dialog.type()).toBe('prompt');
			await dialog.accept('New Folder Name');
		});
		await page.click('button:has-text("New Folder")');
		// Wait for the new folder to appear
		await page.waitForSelector('text=New Folder Name', { timeout: 5000 });
	});

	test('should handle file upload', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', ' kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForSelector('button:has-text("New File")', { timeout: 5000 });

		// Wait for file chooser and click the button to trigger it
		const [fileChooser] = await Promise.all([
			page.waitForEvent('filechooser'),
			page.click('button:has-text("New File")'),
		]);

		await fileChooser.setFiles('tests/sample.txt');
		// Wait for file to appear
		await page.waitForSelector('text=sample.txt', { timeout: 5000 });
		await page.screenshot({ path: 'screenshots/file_upload_success.png' });
		await expect(page.locator('text=sample.txt')).toBeVisible();
	});
});
