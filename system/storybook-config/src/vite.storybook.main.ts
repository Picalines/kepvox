import type { StorybookConfig } from '@storybook/react-vite'
import baseSbConfig from '#base/main'

const config = {
  ...baseSbConfig,

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    builder: '@storybook/builder-vite',
  },

  viteFinal: config => {
    config.server ??= {}
    config.server.allowedHosts = true
    return config
  },
} satisfies StorybookConfig

export default config
