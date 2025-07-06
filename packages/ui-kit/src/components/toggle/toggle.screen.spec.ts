import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'inputs/Toggle',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
})
