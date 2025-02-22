import type { StorybookConfig } from '@storybook/react-vite'
import baseSbConfig from '#main/base'

const config = {
  ...baseSbConfig,

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    builder: '@storybook/builder-vite',
  },
} satisfies StorybookConfig

export default config
