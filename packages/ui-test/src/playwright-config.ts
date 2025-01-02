import type { PlaywrightTestConfig } from '@playwright/test'

export const getPlaywrightConfig = (overrides?: PlaywrightTestConfig): PlaywrightTestConfig => ({
  testDir: '.',
  outputDir: './test-results',

  testMatch: /^.*\.screen\.spec\.ts$/,
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/__screenshots__/{platform}-{projectName}/{arg}{ext}',
  reporter: 'html',

  timeout: 30_000,
  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  use: {
    channel: 'chromium',
    locale: 'en-US',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: false,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],

  retries: 2,
  workers: 8,

  ...overrides,
})
