import type { StorybookConfig } from '@storybook/react-vite'

import { dirname, join } from 'node:path'
import { mergeConfig } from 'vite'

function packagePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    packagePath('@storybook/addon-essentials'),
    packagePath('@storybook/addon-interactions'),
    packagePath('@storybook/addon-links'),
    packagePath('@storybook/addon-themes'),
  ],

  framework: {
    name: packagePath('@storybook/react-vite'),
    options: {},
  },

  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: 'tsconfig.json',
    },
  },

  viteFinal: async config => {
    return mergeConfig(config, await import('@repo/vite-config/storybook'))
  },
}

export default config
