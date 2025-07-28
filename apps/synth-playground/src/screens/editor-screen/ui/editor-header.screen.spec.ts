import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: { title: 'screens/EditorScreen/EditorHeader' },
  themes: ['light', 'dark'],
  windowSize: { width: 800, height: 200 },
  stories: ['Default', 'Playing', 'CodeError'],
})
