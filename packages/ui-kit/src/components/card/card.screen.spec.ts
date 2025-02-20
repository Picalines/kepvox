import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Card',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
})
