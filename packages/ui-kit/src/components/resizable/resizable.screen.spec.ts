import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'layout/Resizable',
  },
  stories: ['Horizontal', 'Vertical', 'TripleHorizontal', 'TripleVertical'],
  themes: ['light', 'dark'],
})
