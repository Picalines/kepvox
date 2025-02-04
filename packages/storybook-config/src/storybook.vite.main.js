import baseSbConfig from '#main/base'
import { mergeViteConfig as mergeSbViteConfig } from './merge-config'

export default mergeSbViteConfig(baseSbConfig, {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    builder: '@storybook/builder-vite',
  },
})
