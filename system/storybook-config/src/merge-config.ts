import type { StorybookConfig as NextStorybookConfig } from '@storybook/nextjs'
import type { StorybookConfig as ViteStorybookConfig } from '@storybook/react-vite'
import type { StorybookConfig as BaseStorybookConfig } from 'storybook/internal/types'

/**
 * Merge two storybook configurations
 *
 * NOTE: this IS NOT a general implementation. Modify this for the needs of this monorepo
 */
const mergeBaseConfig = <TConfig extends BaseStorybookConfig>(
  config1: TConfig,
  config2: Partial<TConfig>,
): TConfig => ({
  ...config1,
  ...config2,

  addons: [...(config1.addons ?? []), ...(config2.addons ?? [])],

  stories: async (...args) => [
    ...(Array.isArray(config1.stories) ? config1.stories : await config1.stories(...args)),
    ...(Array.isArray(config2.stories) ? config2.stories : ((await config2.stories?.(...args)) ?? [])),
  ],
})

export const mergeViteConfig = (
  config1: ViteStorybookConfig,
  config2: Partial<ViteStorybookConfig>,
): ViteStorybookConfig => ({
  ...mergeBaseConfig(config1, config2),

  viteFinal: async (baseConfig, options) => {
    const { viteFinal: viteFinal1 = x => x } = config1
    const { viteFinal: viteFinal2 = x => x } = config2
    return await viteFinal2(await viteFinal1(baseConfig, options), options)
  },
})

export const mergeNextConfig = (
  config1: NextStorybookConfig,
  config2: Partial<NextStorybookConfig>,
): NextStorybookConfig => ({
  ...mergeBaseConfig(config1, config2),

  webpackFinal: async (baseConfig, options) => {
    const { webpackFinal: webpackFinal1 = x => x } = config1
    const { webpackFinal: webpackFinal2 = x => x } = config2
    return await webpackFinal2(await webpackFinal1(baseConfig, options), options)
  },
})
