import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import tailwindcss from 'tailwindcss'
import { mergeConfig } from 'vite'
import baseViteConfig from '#base'

export default mergeConfig(baseViteConfig, {
  plugins: [react()],

  css: {
    postcss: {
      plugins: [tailwindcss(), postcssImport(), autoprefixer()],
    },
  },

  test: {
    environment: 'jsdom',
  },
})
