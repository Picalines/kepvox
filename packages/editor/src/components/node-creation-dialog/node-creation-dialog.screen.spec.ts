import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'dialogs/NodeCreationDialog',
  },
  stories: ['Default'],
  themes: ['light'],
  fullPage: true,
  windowSize: { width: 800, height: 600 },
  act: async page => {
    await page.getByText('Select type').waitFor({ state: 'visible' })
  },
})
