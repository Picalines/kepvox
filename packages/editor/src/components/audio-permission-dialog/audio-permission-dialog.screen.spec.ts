import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/AudioPermissionDialog',
  },
  stories: ['Default'],
  themes: ['light'],
  fullPage: true,
  windowSize: { width: 800, height: 600 },
  act: async page => {
    await page.getByText('Audio permission').waitFor({ state: 'visible' })
  },
})
