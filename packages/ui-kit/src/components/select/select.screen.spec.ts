import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Select',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
})

testStoryMatrix({
  meta: {
    title: 'components/Select',
  },
  stories: ['Open', 'OpenMany'],
  themes: ['light', 'dark'],
  fullPage: true,
  windowSize: { width: 450, height: 500 },
  act: async page => {
    await page.locator('#group-0').waitFor({ state: 'visible' })
  },
})
