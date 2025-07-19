# kepvox

[Web audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) synthesizer inspired by [SunVox](https://www.warmplace.ru/soft/sunvox/index_ru.php)

<p align="center">
  <img width="45%" alt="image" src="https://github.com/user-attachments/assets/3b71e24a-355b-4046-90fb-5ef626bcb2c5" />
  <img width="45%" alt="image" src="https://github.com/user-attachments/assets/4a436cb2-2517-4aa6-b6e7-3496f10756c0" />
</p>

<p align="center">
  <a href="https://picalines.github.io/kepvox/synth-playground/" style="text-decoration: none">
    <img alt="synth package playground" src="https://img.shields.io/badge/synth_package_playground-black?style=for-the-badge&logo=github&link=https%3A%2F%2Fpicalines.github.io%2Fkepvox%2Fsynth-playground"></a>
</p>

## Development

### Packages

Applications:
- **[Synth Playground](./apps/synth-playground/README.md)** - Interactive playground for experimenting with [synth](./packages/synth/README.md) package
- *Coming soon*

Libraries:
- **[@repo/synth](./packages/synth/README.md)** - Core synthesizer engine with node-based architecture
- **[@repo/editor](./packages/editor/README.md)** - Visual node-based editor for creating tracks
- **[@repo/ui-kit](./packages/ui-kit/README.md)** - UI component library
- **[@repo/web-audio](./packages/web-audio/README.md)** - Low-level Web Audio API utilities and helpers
- **[@repo/common](./packages/common/README.md)** - Shared utilities and common functions

### Scripts

```bash
pnpm install # Install dependencies
pnpm add turbo --global # Use turbo to run scripts

turbo dev # Start all development servers

turbo test:unit # Run unit tests
turbo test:screen # Run playwright tests

turbo lint # Check formatting and types
turbo lint:fix # Fix formatting
turbo lint:fix-unsafe # Apply potentially breaking fixes if available
```
