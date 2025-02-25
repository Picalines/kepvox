import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Loader',
  },
  stories: ['Default', 'Centered'],
  themes: ['light', 'dark'],
})
