import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Separator',
  },
  stories: ['Horizontal', 'Vertical'],
  themes: ['light', 'dark'],
})
