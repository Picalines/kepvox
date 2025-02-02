import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mergeConfig } from 'vite'
import baseViteConfig from '#base'

export default mergeConfig(baseViteConfig, {
  plugins: [react(), tailwindcss()],

  test: {
    environment: 'jsdom',
  },
})
