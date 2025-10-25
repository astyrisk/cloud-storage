import { test, expect } from '@playwright/test';

test.describe('Photo Component', () => {

	test('new gallery button visibility', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/photo');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("New Gallery")')).toBeVisible();

	});

	test('new gallery button handling', async ({ page }) => {

		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/photo');
		await page.waitForTimeout(3000);

		await page.click('button:has-text("New Gallery")');
		await page.waitForTimeout(3000);
		await page.screenshot({ path: 'screenshots/New_Gallery.png' });
		await expect(page.locator('text=new gallery')).toBeVisible({ timeout: 20000 });
		await page.screenshot({ path: 'screenshots/new_gallery.png' });
	});

	test('upload file to gallery', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/photo');
		await page.waitForTimeout(3000);
		await page.click('text=New Gallery Name');
		await page.waitForTimeout(3000);
		await page.waitForSelector('button:has-text("upload")');
		const [fileChooser] = await Promise.all([
			page.waitForEvent('filechooser'),
			page.click('button:has-text("upload")'),
		]);

		await fileChooser.setFiles('tests/sample_image.jpg');
		await page.waitForTimeout(3000);
		await page.screenshot({ path: 'screenshots/image_upload_success.png' });
		await expect(page.locator('img[alt="sample_image.jpg"]')).toBeVisible();
	});

	test('go back to gallery list', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/photos');
		await page.waitForTimeout(3000);
		await page.click('text=New Gallery Name');
		await page.waitForTimeout(3000);
		await page.click('button:has-text("go back")');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("New Gallery")')).toBeVisible();
	});
});
