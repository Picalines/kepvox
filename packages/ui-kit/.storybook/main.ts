import type { StorybookConfig } from '@storybook/react-vite'

import { dirname, join } from 'node:path'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import tailwindcss from 'tailwindcss'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

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
      tsconfigPath: '../tsconfig.json',
    },
  },

  viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()],
      css: {
        postcss: {
          plugins: [tailwindcss(), postcssImport(), autoprefixer()],
        },
      },
    })
  },
}

export default config
