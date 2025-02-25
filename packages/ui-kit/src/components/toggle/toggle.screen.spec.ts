import { testStoryMatrix } from '@repo/test-screen/test-story'

testStoryMatrix({
  meta: {
    title: 'components/Toggle',
  },
  stories: ['Default'],
  themes: ['light', 'dark'],
})
