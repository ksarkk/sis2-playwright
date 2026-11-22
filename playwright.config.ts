import { defineConfig } from '@playwright/test';
const ci = Boolean(process.env.CI);
const baseURL = 'http://127.0.0.1:4173';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  workers: ci ? 2 : undefined,
  reporter: ci ? [['list'], ['blob'], ['junit', { outputFile: 'reports/junit.xml' }]]
               : [['list'], ['html', { open: 'never' }]],
  use: { baseURL, browserName: 'chromium', trace: 'on-first-retry', screenshot: 'only-on-failure' },
  webServer: { command: 'node server.cjs', url: baseURL, reuseExistingServer: !ci },
});
