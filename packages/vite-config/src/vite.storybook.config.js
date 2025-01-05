import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import tailwindcss from 'tailwindcss'
import { mergeConfig } from 'vite'
import baseViteConfig from '#base'

export default mergeConfig(baseViteConfig, {
  css: {
    postcss: {
      plugins: [tailwindcss(), postcssImport(), autoprefixer()],
    },
  },
})
