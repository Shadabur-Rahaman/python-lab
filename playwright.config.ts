import {defineConfig} from '@playwright/test';

const port = 4175;
const baseURL = `http://127.0.0.1:${port}/python-lab/`;

export default defineConfig({
  testDir: './tests/browser',
  timeout: 120_000,
  workers: 1,
  use: {
    baseURL,
    channel: process.env.PYTHON_LAB_BROWSER_CHANNEL || undefined,
    actionTimeout: 12_000,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run preview -- --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
