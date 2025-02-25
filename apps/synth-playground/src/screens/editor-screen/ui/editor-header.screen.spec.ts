import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'screens/EditorScreen/EditorHeader',
  },
  stories: ['Idle'],
  themes: ['light', 'dark'],
  windowSize: {
    width: 800,
    height: 200,
  },
})
