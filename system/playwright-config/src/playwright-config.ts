import { type PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: '.',
  outputDir: './test-results',

  testMatch: /^.*\.screen\.spec\.ts$/,
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/__screenshots__/{platform}-{projectName}/{arg}{ext}',
  reporter: 'html',

  timeout: 30_000,
  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
    },
  },

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
        ...devices['Desktop Chrome'],
      },
    },
  ],

  retries: 2,
  workers: process.env.CI ? undefined : 8,

  webServer: {
    command: 'pnpm run playwright:server',
    port: Number(process.env.PLAYWRIGHT_PORT),
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
}

export default config
