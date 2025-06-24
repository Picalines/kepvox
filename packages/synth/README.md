# @repo/synth

Core synthesizer engine

## Features

- **Node-based Architecture**: Modular synthesis using interconnected nodes
- **Automation System**: Parameter automation and modulation support
- **Time Management**: Precise timing and synchronization for audio events

## Usage

```typescript
import { SynthContext, Node, Param } from '@repo/synth'

const context = new SynthContext(new AudioContext())

const oscillator = new OscillatorNode(context)
const reverb = new ReverbNode(context)

oscillator.connect(reverb)
reverb.connect(context.output)
```

## Development

```bash
# Start Storybook
pnpm dev

# Run tests
pnpm test:unit
pnpm test:screen
```

