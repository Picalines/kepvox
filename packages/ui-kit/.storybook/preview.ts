import { withThemeByClassName } from '@storybook/addon-themes'

import type { Preview } from '@storybook/react'

import '../src/styles/index.css'

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
}

export default preview
