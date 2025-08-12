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
    root: '.',
    globals: false,

    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.unit.spec.ts(x)?'],
          environment: 'node',
          css: false,
          typecheck: {
            enabled: true,
            tsconfig: './tsconfig.json',
            include: ['**/*.unit.spec-d.ts(x)?'],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'dom-unit',
          include: ['**/*.dom-unit.spec.ts(x)?'],
          environment: 'jsdom',
          setupFiles: './vitest.setup.js',
          css: false,
        },
      },
    ],
  },
})
