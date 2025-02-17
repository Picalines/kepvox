import baseConfig from '@repo/storybook-config/main/nextjs'
import { mergeNextConfig } from '@repo/storybook-config/merge'

export default mergeNextConfig(baseConfig, {
  webpackFinal: config => {
    config.module?.rules?.push({
      test: /^.+\.txt$/,
      type: 'asset/source',
    })

    return config
  },
})
