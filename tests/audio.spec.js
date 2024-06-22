import { test, expect } from '@playwright/test';

test.describe('Audio Component', () => {

	test('login and redirect to audio page', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForSelector('button:has-text("upload")');
		await page.goto('http://localhost:5173/audio');
		await page.waitForTimeout(3000);
		await expect(page).toHaveURL('http://localhost:5173/audio');
	});

	test('upload button visibility', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/audio');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("upload")')).toBeVisible();
	});

	test('should handle new artist creation', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/audio');
		await page.waitForTimeout(3000);

		page.on('dialog', async dialog => {
			expect(dialog.type()).toBe('prompt');
			await dialog.accept('New Artist Name');
		});
		await page.click('button:has-text("upload")');
		await page.waitForTimeout(3000);
		await expect(page.locator('text=New Artist Name')).toBeVisible();
	});

	test('upload audio file to artist', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/audio');
		await page.waitForTimeout(3000);

		await page.click('text=New Artist Name'); // Assuming this is the artist created in the previous test
		await page.waitForTimeout(3000);

		await page.waitForSelector('button:has-text("upload")');
		const [fileChooser] = await Promise.all([
			page.waitForEvent('filechooser'),
			page.click('button:has-text("upload")'), // Click triggers file chooser
		]);

		await fileChooser.setFiles('tests/sample_audio.mp3');
		await page.waitForTimeout(3000);
		await page.screenshot({ path: 'screenshots/audio_upload_success.png' });
		await expect(page.locator('text=sample_audio.mp3')).toBeVisible();
	});

	test('go back to artist list', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.goto('http://localhost:5173/audio');
		await page.waitForTimeout(3000);

		await page.click('text=New Artist Name');
		await page.waitForTimeout(3000);
		await page.click('button:has-text("go back")');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("upload")')).toBeVisible();
	});
});
