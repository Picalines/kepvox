import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Separator',
  },
  stories: ['Horizontal', 'Vertical'],
  themes: ['light', 'dark'],
})
