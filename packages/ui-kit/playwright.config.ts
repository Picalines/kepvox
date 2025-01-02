import { getPlaywrightConfig } from '@repo/ui-test/playwright-config'

const { STORYBOOK_URL } = process.env

if (typeof STORYBOOK_URL !== 'string') {
  throw new Error('missing env variable STORYBOOK_URL')
}

export default getPlaywrightConfig({
  webServer: {
    command: 'pnpm run dev:storybook:server',
    url: STORYBOOK_URL,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
