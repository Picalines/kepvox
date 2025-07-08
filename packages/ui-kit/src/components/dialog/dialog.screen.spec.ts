import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'layout/Dialog',
  },
  stories: ['Open'],
  themes: ['light', 'dark'],
  fullPage: true,
  windowSize: { width: 800, height: 600 },
  act: async page => {
    await page.getByText('Content').waitFor({ state: 'visible' })
  },
})
