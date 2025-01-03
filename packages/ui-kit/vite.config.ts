import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

// Vite is used for storybook and vitest

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss(), postcssImport(), autoprefixer()],
    },
  },

  test: {
    root: './src',
    include: ['**/*.spec.ts(x)'],
    exclude: ['**/*.screen.spec.ts(x)'],
    globals: true,
    environment: 'jsdom',
  },

  build: {
    rollupOptions: {
      onwarn: (warning, report) => {
        // Ignore the 'use client' directive warning
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }

        report(warning)
      },
    },
  },
})
