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
    globals: false,

    workspace: [
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
          css: false,
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['**/*.browser.spec.ts(x)?'],
          setupFiles: ['./vitest.setup.browser.ts'],
          browser: {
            enabled: true,
            provider: 'playwright',
            headless: true,
            screenshotFailures: false,
            instances: [
              {
                browser: 'chromium',
                viewport: { width: 800, height: 600 },
              },
            ],
          },
        },
      },
    ],
  },
})
