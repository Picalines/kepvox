import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/MusicSheetTile',
  },
  stories: ['Default', 'Readonly'],
  themes: ['light', 'dark'],
})
