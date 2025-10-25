import { test, expect } from '@playwright/test';
import fs from 'fs';

if (!fs.existsSync('screenshots')) {
	fs.mkdirSync('screenshots');
}

const baseURL = 'http://localhost:5173';
const credentials = {
	email: 'kar@gmail.com',
	password: '01050105'
};

test.describe('Root Component', () => {

	test('login', async ({ page }) => {
		await page.goto(`${baseURL}/login`);
		await page.waitForTimeout(3000);
		await page.fill('input#email', credentials.email);
		await page.fill('input#password', credentials.password);
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.waitForURL(`${baseURL}/`, { timeout: 20000 });
		await page.screenshot({ path: 'screenshots/login_success.png' });
		await page.waitForSelector('button:has-text("New File")', { timeout: 20000 });
		await page.screenshot({ path: 'screenshots/login_success.png' });
	});

	test('redirect to homepage after login', async ({ page }) => {
		await page.goto(`${baseURL}/login`);
		await page.waitForTimeout(3000);
		await page.fill('input#email', credentials.email);
		await page.fill('input#password', credentials.password);
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.waitForURL(`${baseURL}/`, { timeout: 20000 });
		await expect(page).toHaveURL(`${baseURL}/`, { timeout: 20000 });
		await page.screenshot({ path: 'screenshots/redirect_homepage.png' });
	});

	test('new file and folder buttons', async ({ page }) => {
		await page.goto(`${baseURL}/login`);
		await page.waitForTimeout(3000);
		await page.fill('input#email', credentials.email);
		await page.fill('input#password', credentials.password);
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.waitForURL(`${baseURL}/`, { timeout: 20000 });
		await expect(page.locator('button:has-text("New File")')).toBeVisible({ timeout: 20000 });
		await expect(page.locator('button:has-text("New Folder")')).toBeVisible({ timeout: 20000 });
		await page.screenshot({ path: 'screenshots/new_buttons_visible.png' });
	});

	test('should handle new folder creation', async ({ page }) => {
		await page.goto(`${baseURL}/login`);
		await page.waitForTimeout(3000);
		await page.fill('input#email', credentials.email);
		await page.fill('input#password', credentials.password);
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.waitForURL(`${baseURL}/`, { timeout: 20000 });
		await page.click('button:has-text("New Folder")');
		await page.waitForTimeout(3000);
		await page.screenshot({ path: 'screenshots/New_Folder.png' });
		await expect(page.locator('text=New Folder Name')).toBeVisible({ timeout: 20000 });
		await page.screenshot({ path: 'screenshots/new_folder_created.png' });
	});

	test('should handle file upload', async ({ page }) => {
		await page.goto(`${baseURL}/login`);
		await page.waitForTimeout(3000);
		await page.fill('input#email', credentials.email);
		await page.fill('input#password', credentials.password);
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.waitForURL(`${baseURL}/`, { timeout: 20000 });

		await page.waitForSelector('button:has-text("New File")', { timeout: 20000 });
		const [fileChooser] = await Promise.all([
			page.waitForEvent('filechooser'),
			page.click('button:has-text("New File")'),
		]);

		await fileChooser.setFiles('tests/sample.txt');
		await page.waitForTimeout(5000);
		await page.screenshot({ path: 'screenshots/file_upload_success.png' });
		await expect(page.locator('text=sample.txt')).toBeVisible({ timeout: 20000 });
	});
});
