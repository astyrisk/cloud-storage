import { test, expect } from '@playwright/test';

test.describe('Video Component', () => {

	test('login and redirect to video page', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.waitForSelector('button:has-text("New Gallery")');
		await page.goto('http://localhost:5173/video');
		await page.waitForTimeout(3000);
		await expect(page).toHaveURL('http://localhost:5173/video');
	});

	test('new gallery button visibility', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.waitForTimeout(3000);
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/video');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("New Gallery")')).toBeVisible();
	});

	test('should handle new gallery creation', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.waitForTimeout(3000);
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/video');
		await page.waitForTimeout(3000);

		page.on('dialog', async dialog => {
			expect(dialog.type()).toBe('prompt');
			await dialog.accept('New Gallery Name');
		});
		await page.click('button:has-text("New Gallery")');
		await page.waitForTimeout(3000);
		await expect(page.locator('text=New Gallery Name')).toBeVisible();
	});

	test('upload video file to gallery', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/video');
		await page.waitForTimeout(3000);

		await page.click('text=New Gallery Name');
		await page.waitForTimeout(3000);

		await page.waitForSelector('button:has-text("upload")');
		const [fileChooser] = await Promise.all([
			page.waitForEvent('filechooser'),
			page.click('button:has-text("upload")'),
		]);

		await fileChooser.setFiles('tests/sample_video.mp4');
		await page.waitForTimeout(3000);
		await page.screenshot({ path: 'screenshots/video_upload_success.png' });
		await expect(page.locator('text=sample_video.mp4')).toBeVisible();
	});

	test('view video in gallery', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/video');
		await page.waitForTimeout(3000);

		await page.click('text=New Gallery Name');
		await page.waitForTimeout(3000);
		await page.click('img[alt="sample_video.mp4"]');
		await page.waitForTimeout(3000);
		await expect(page.locator('video')).toBeVisible();
	});

	test('go back to gallery list', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/video');
		await page.waitForTimeout(3000);
		await page.click('text=New Gallery Name');
		await page.waitForTimeout(3000);
		await page.click('button:has-text("go back")');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("New Gallery")')).toBeVisible();
	});
});
