import { withThemeByClassName } from '@storybook/addon-themes'

/**
 * @type {import('@storybook/react').Preview}
 */
const preview = {
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
