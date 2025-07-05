import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'
import baseViteConfig from '#base'

export default mergeConfig(baseViteConfig, {
  plugins: [tailwindcss()],
})
