import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Loader',
  },
  stories: ['Default', 'Centered'],
  themes: ['light', 'dark'],
})
