import type { Config } from 'tailwindcss'

import tailwindAnimatePlugin from 'tailwindcss-animate'

export type OptionalConfig = { [K in keyof Config as 'content' extends K ? never : K]: Config[K] }

const config: OptionalConfig = {
  plugins: [tailwindAnimatePlugin],

  darkMode: 'class',

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
  },
}

export default config
