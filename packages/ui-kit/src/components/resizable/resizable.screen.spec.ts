import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Resizable',
  },
  stories: ['Horizontal', 'Vertical', 'TripleHorizontal', 'TripleVertical'],
  themes: ['light', 'dark'],
})
