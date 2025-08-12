import type { StorybookConfig } from '@storybook/nextjs'
import baseSbConfig from '#base/main'

const config = {
  ...baseSbConfig,

  framework: '@storybook/nextjs',

  core: {
    builder: '@storybook/builder-webpack5',
  },

  webpackFinal: config => {
    config.module?.rules?.push({
      test: /^.+\.txt$/,
      type: 'asset/source',
    })

    config.infrastructureLogging = { level: 'warn' }

    return config
  },
} satisfies StorybookConfig

export default config
