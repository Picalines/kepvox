import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'tiles/MusicSheet',
  },
  stories: ['Default', 'Readonly'],
  themes: ['light', 'dark'],
})
