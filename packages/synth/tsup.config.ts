import { defineConfig } from 'tsup'

export default defineConfig({
  outDir: 'out',
  entry: ['./src/index.ts'],
  format: ['esm'],
  splitting: false,
  clean: true,
  dts: {
    compilerOptions: {
      lib: ['ESNext', 'DOM'],
      baseUrl: '.',
    },
  },
})
