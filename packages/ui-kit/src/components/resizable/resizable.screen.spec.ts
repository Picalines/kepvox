import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Resizable',
  },
  stories: ['Horizontal', 'Vertical', 'TripleHorizontal', 'TripleVertical'],
  themes: ['light', 'dark'],
})
