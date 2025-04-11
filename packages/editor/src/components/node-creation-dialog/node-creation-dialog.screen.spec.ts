import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/NodeCreationDialog',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
  fullPage: true,
  windowSize: { width: 800, height: 600 },
  act: async page => {
    await page.getByText('Select type').waitFor({ state: 'visible' })
  },
})
