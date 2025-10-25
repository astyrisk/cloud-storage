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

test.describe('login page', () => {

	test('login', async ({ page }) => {
		// Login process
		await page.goto(`${baseURL}/login`);
		await page.waitForTimeout(3000);
		await page.fill('input#email', credentials.email);
		await page.fill('input#password', credentials.password);
		await page.click('button[type=submit]');
		await page.screenshot({ path: 'screenshots/login_success.png' });
		await page.waitForURL(`${baseURL}/`, { timeout: 20000 });
		await page.screenshot({ path: 'screenshots/login_success.png' });
		await page.waitForSelector('button:has-text("New File")', { timeout: 20000 });
		await page.screenshot({ path: 'screenshots/login_success.png' });
	});

	test('redirect to homepage after login', async ({ page }) => {
		// Login process
		await page.goto(`${baseURL}/login`);
		await page.waitForTimeout(3000);
		await page.fill('input#email', credentials.email);
		await page.fill('input#password', credentials.password);
		await page.click('button[type=submit]');
		await page.waitForTimeout(5000);
		await page.screenshot({ path: 'screenshots/redirect_homepage.png' });
		await page.waitForURL(`${baseURL}`, { timeout: 20000 });
		await expect(page).toHaveURL(`${baseURL}`, { timeout: 20000 });
		await page.screenshot({ path: 'screenshots/redirect_homepage.png' });
	});
});

