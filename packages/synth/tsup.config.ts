import { defineConfig } from 'tsup'

export default defineConfig({
  outDir: 'dist',
  entry: ['./src/index.ts'],
  format: ['esm'],
  splitting: false,
  clean: true,
  dts: {
    compilerOptions: {
      lib: ['ESNext', 'DOM'],
      baseUrl: '.',
      paths: {
        '#context': ['src/context/index.ts'],
        '#internal-symbols': ['src/internal-symbols.ts'],
        '#math': ['src/math/index.ts'],
        '#node': ['src/node/index.ts'],
        '#param': ['src/param/index.ts'],
        '#units': ['src/units.ts'],
        '#util/*': ['src/util/*/index.ts'],
      },
    },
  },
})
