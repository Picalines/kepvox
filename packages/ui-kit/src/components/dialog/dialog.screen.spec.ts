import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Dialog',
  },
  stories: ['Open'],
  themes: ['light', 'dark'],
  fullPage: true,
  windowSize: { width: 800, height: 600 },
  act: async page => {
    await page.locator('#dialog-content').waitFor({ state: 'visible' })
  },
})
