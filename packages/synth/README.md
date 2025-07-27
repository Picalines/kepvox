# @repo/synth

Core synthesizer engine

## Features

- **Node-based Architecture**: Modular synthesis using interconnected nodes
- **Automation System**: Parameter automation and modulation support
- **Time Management**: Precise timing and synchronization for audio events

## Usage

```typescript
import { Synth, OscillatorNode, ReverbSynthNode } from '@repo/synth'

const synth = new Synth(new AudioContext())

const oscillator = new OscillatorNode(synth)
const reverb = new ReverbSynthNode(synth)

oscillator.connect(reverb)
reverb.connect(synth.output)
```

## Development

See [the root README](../../README.md) for a list of available scripts

