import { test, expect } from '@playwright/test';

test.describe('Document Component', () => {

	test('login and redirect to document page', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.waitForSelector('button:has-text("New Library")');
		await page.goto('http://localhost:5173/document');
		await page.waitForTimeout(3000);
		await expect(page).toHaveURL('http://localhost:5173/document');
	});

	test('new library button visibility', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/document');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("New Library")')).toBeVisible();
	});

	test('should handle new library creation', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/document');
		await page.waitForTimeout(3000);

		page.on('dialog', async dialog => {
			expect(dialog.type()).toBe('prompt');
			await dialog.accept('New Library Name');
		});
		await page.click('button:has-text("New Library")');
		await page.waitForTimeout(3000);
		await expect(page.locator('text=New Library Name')).toBeVisible();
	});

	test('upload document file to library', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/document');
		await page.waitForTimeout(3000);

		await page.click('text=New Library Name');
		await page.waitForTimeout(3000);

		await page.waitForSelector('button:has-text("upload")');
		const [fileChooser] = await Promise.all([
			page.waitForEvent('filechooser'),
			page.click('button:has-text("upload")'),
		]);

		await fileChooser.setFiles('tests/sample_document.pdf');
		await page.waitForTimeout(3000);
		await page.screenshot({ path: 'screenshots/document_upload_success.png' });
		await expect(page.locator('text=sample_document.pdf')).toBeVisible();
	});

	test('view document in library', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/document');
		await page.waitForTimeout(3000);

		await page.click('text=New Library Name');
		await page.waitForTimeout(3000);
		await page.click('text=sample_document.pdf');
		await page.waitForTimeout(3000);
		await expect(page.locator('embed[type="application/pdf"]')).toBeVisible();
	});

	test('go back to library list', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await page.waitForTimeout(3000);
		await page.fill('input#email', 'kar@gmail.com');
		await page.fill('input#password', '01050105');
		await page.click('button[type=submit]');
		await page.waitForTimeout(3000);
		await page.goto('http://localhost:5173/document');
		await page.waitForTimeout(3000);

		await page.click('text=New Library Name');
		await page.waitForTimeout(3000);
		await page.click('button:has-text("go back")');
		await page.waitForTimeout(3000);
		await expect(page.locator('button:has-text("New Library")')).toBeVisible();
	});
});
