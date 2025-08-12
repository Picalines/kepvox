import type { StorybookConfig } from 'storybook/internal/types'

const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: ['@storybook/addon-themes'],

  typescript: {
    check: false,
  },
} satisfies StorybookConfig

export default config
