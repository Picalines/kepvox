import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'inputs/Select',
  },
  stories: ['Default', 'WithValue', 'Disabled', 'DisabledWithValue'],
  themes: ['light', 'dark'],
})

testStoryMatrix({
  meta: {
    title: 'inputs/Select',
  },
  stories: ['Open', 'OpenWithValue', 'OpenMany'],
  themes: ['light', 'dark'],
  fullPage: true,
  windowSize: { width: 450, height: 500 },
  act: async page => {
    await page.locator('#group-0').waitFor({ state: 'visible' })
  },
})
