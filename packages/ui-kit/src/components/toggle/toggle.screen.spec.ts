import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Toggle',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
})
