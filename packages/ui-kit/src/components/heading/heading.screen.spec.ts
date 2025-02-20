import { testStoryMatrix } from '@repo/ui-test/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Heading',
  },
  stories: ['Default', 'Center', 'Right', 'NoSuperTitle', 'NoDescription', 'NoTitle'],
  themes: ['light', 'dark'],
})
