import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Text',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
})
