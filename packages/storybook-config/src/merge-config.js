/**
 * Merge two storybook configurations
 *
 * NOTE: this IS NOT a general implementation. Modify this for the needs of this monorepo
 *
 * @param {import("storybook/internal/types").StorybookConfig} config1
 * @param {Partial<import("storybook/internal/types").StorybookConfig>} config2
 * @returns {import("storybook/internal/types").StorybookConfig}
 */
const mergeBaseConfig = (config1, config2) => ({
  ...config1,
  ...config2,
  stories: [...(config1.stories ?? []), ...(config2.stories ?? [])],
  addons: [...(config1.addons ?? []), ...(config2.addons ?? [])],
})

/**
 * @param {import("@storybook/react-vite").StorybookConfig} config1
 * @param {Partial<import("@storybook/react-vite").StorybookConfig>} config2
 * @returns {import("@storybook/react-vite").StorybookConfig}
 */
export const mergeViteConfig = (config1, config2) => ({
  ...mergeBaseConfig(config1, config2),

  viteFinal: async (baseConfig, options) => {
    const { viteFinal: viteFinal1 = x => x } = config1
    const { viteFinal: viteFinal2 = x => x } = config2
    return await viteFinal2(await viteFinal1(baseConfig, options), options)
  },
})

/**
 * @param {import("@storybook/nextjs").StorybookConfig} config1
 * @param {Partial<import("@storybook/nextjs").StorybookConfig>} config2
 * @returns {import("@storybook/nextjs").StorybookConfig}
 */
export const mergeNextConfig = (config1, config2) => ({
  ...mergeBaseConfig(config1, config2),

  webpackFinal: async (baseConfig, options) => {
    const { webpackFinal: webpackFinal1 = x => x } = config1
    const { webpackFinal: webpackFinal2 = x => x } = config2
    return await webpackFinal2(await webpackFinal1(baseConfig, options), options)
  },
})
