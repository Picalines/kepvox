import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'tiles/MusicSheet/PlaybackControls',
  },
  stories: ['Default', 'Playing'],
  themes: ['light', 'dark'],
})
