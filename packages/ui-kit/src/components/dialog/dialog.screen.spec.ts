import { testStory } from '@repo/ui-test/test-story'

testStory({
  title: 'components/Dialog',
  story: 'Default',
  theme: ['light', 'dark'],

  fullPage: true,
  windowSize: { width: 800, height: 600 },

  act: async page => {
    const trigger = page.locator('#dialog-trigger')
    await trigger.waitFor()
    await trigger.click()
  },
})
