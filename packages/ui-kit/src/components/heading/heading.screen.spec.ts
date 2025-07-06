import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'typography/Heading',
  },
  stories: ['Default', 'Center', 'Right', 'NoSuperTitle', 'NoDescription', 'NoTitle'],
  themes: ['light', 'dark'],
})
