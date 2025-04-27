import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/MusicSheetTile/PlaybackControls',
  },
  stories: ['Default', 'Playing'],
  themes: ['light', 'dark'],
})
