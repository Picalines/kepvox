import type { StorybookConfig } from '@storybook/react-vite'

import { dirname, join } from 'node:path'

function packagePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    packagePath('@storybook/addon-links'),
    packagePath('@storybook/addon-essentials'),
    packagePath('@storybook/addon-interactions'),
  ],

  framework: {
    name: packagePath('@storybook/react-vite'),
    options: {},
  },

  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: '../tsconfig.json',
    },
  },

  async viteFinal(config) {
    const { mergeConfig } = await import('vite')

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': join(packagePath('..'), 'src'),
        },
      },
    })
  },
}

export default config
