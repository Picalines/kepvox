# kepvox

[Web audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) synthesizer inspired by [SunVox](https://www.warmplace.ru/soft/sunvox/index_ru.php)

<img width="1540" alt="image" src="https://github.com/user-attachments/assets/c9f743a8-a303-4bc5-95a1-6292ad2c92b3" />

## Packages

## Applications

- **[Social App](./apps/social/README.md)** - Social platform for sharing and discovering tracks (will be reworked)
- **[Synth Playground](./apps/synth-playground/README.md)** - Interactive playground for experimenting with live coding synthesis

### Core Libraries
- **[@repo/synth](./packages/synth/README.md)** - Core synthesizer engine with node-based architecture
- **[@repo/editor](./packages/editor/README.md)** - Visual node-based editor for creating tracks
- **[@repo/ui-kit](./packages/ui-kit/README.md)** - UI component library
- **[@repo/web-audio](./packages/web-audio/README.md)** - Low-level Web Audio API utilities and helpers
- **[@repo/common](./packages/common/README.md)** - Shared utilities and common functions

## Development

This is a TypeScript monorepo managed with pnpm and Turborepo.

```bash
pnpm install # Install dependencies

pnpm dev # Start all development servers

pnpm test:unit # Run unit tests
pnpm test:screen # Run playwright tests

# Formatting and linting with Biome
pnpm format
pnpm lint
pnpm fix
```
