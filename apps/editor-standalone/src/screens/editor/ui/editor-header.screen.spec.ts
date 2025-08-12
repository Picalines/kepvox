import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: { title: 'screens/Editor/EditorHeader' },
  themes: ['light', 'dark'],
  windowSize: { width: 800, height: 200 },
  stories: ['Default'],
})
