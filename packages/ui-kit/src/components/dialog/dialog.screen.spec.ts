import { testStoryMatrix } from '@repo/ui-test/test-story'
import meta from './dialog.stories'

testStoryMatrix({
  meta,
  stories: ['Default'],
  themes: ['light', 'dark'],

  fullPage: true,
  windowSize: { width: 800, height: 600 },

  act: async page => {
    const trigger = page.locator('#dialog-trigger')
    await trigger.waitFor()
    await trigger.click()
  },
})
