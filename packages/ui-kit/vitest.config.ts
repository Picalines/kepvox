import react from '@vitejs/plugin-react'
import { mergeConfig } from 'vite'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, {
  plugins: [react()],

  test: {
    root: './src',
    include: ['**/*.spec.ts(x)'],
    exclude: ['**/*.screen.spec.ts(x)'],
    globals: true,
    environment: 'jsdom',
  },
})
