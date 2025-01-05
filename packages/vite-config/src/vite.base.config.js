/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
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

  test: {
    root: './src',
    include: ['**/*.spec.ts(x)?'],
    exclude: ['**/*.screen.spec.ts(x)?'],
    globals: true,
    environment: 'node',
  },
})
