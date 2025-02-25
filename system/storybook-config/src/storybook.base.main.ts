import type { StorybookConfig } from 'storybook/internal/types'

const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-themes',
  ],

  typescript: {
    check: false,
  },
} satisfies StorybookConfig

export default config
