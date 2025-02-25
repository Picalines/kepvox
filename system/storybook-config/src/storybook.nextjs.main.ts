import type { StorybookConfig } from '@storybook/nextjs'
import baseSbConfig from '#main/base'

const config = {
  ...baseSbConfig,

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  core: {
    builder: '@storybook/builder-webpack5',
  },
} satisfies StorybookConfig

export default config
