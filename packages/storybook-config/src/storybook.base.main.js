/**
 * @type {import('@storybook/react-vite').StorybookConfig}
 */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-themes',
  ],

  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: 'tsconfig.json',
    },
  },
}

export default config
