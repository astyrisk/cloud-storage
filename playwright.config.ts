// import type { PlaywrightTestConfig } from '@playwright/test';
//
// const config: PlaywrightTestConfig = {
// 	webServer: {
// 		command: 'npm run build && npm run preview',
// 		port: 4173
// 	},
// 	testDir: 'tests',
// 	testMatch: /(.+\.)?(test|spec)\.[jt]s/
// };
//
// export default config;

import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		timeout: 120000, // Timeout for starting the server (120 seconds)
		reuseExistingServer: true, // Reuse the server if already running
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	timeout: 60000, // Global test timeout (60 seconds)
	use: {
		browserName: 'chromium', // Default browser is Chromium
		headless: false, // Run in headed mode for debugging (set to true for CI)
		screenshot: 'on', // Automatically take screenshots on failure
		trace: 'on-first-retry', // Capture trace for debugging on the first retry
	},
	retries: 1, // Retry failed tests once
	reporter: [['list'], ['html', { open: 'on-failure' }]], // Use list and HTML reporters
};

export default config;
