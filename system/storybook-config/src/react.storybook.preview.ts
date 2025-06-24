import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'

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

  parameters: {
    controls: {
      exclude: /^on.+/,
    },
  },
}

export default preview
