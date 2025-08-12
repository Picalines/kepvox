import type { StorybookConfig } from '@storybook/react-vite'
import baseSbConfig from '#base/main'

const config = {
  ...baseSbConfig,

  framework: '@storybook/react-vite',

  viteFinal: config => {
    config.server ??= {}
    config.server.allowedHosts = true
    return config
  },
} satisfies StorybookConfig

export default config
