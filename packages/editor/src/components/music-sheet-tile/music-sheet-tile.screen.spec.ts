import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/MusicSheetTile',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
})
