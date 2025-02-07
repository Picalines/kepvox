import baseSbConfig from '#main/base'
import { mergeNextConfig } from './merge-config'

export default mergeNextConfig(baseSbConfig, {
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  core: {
    builder: '@storybook/builder-webpack5',
  },
})
