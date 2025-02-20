import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Text',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
})
