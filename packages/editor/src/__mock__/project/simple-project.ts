import type { Project } from '#model'

export const simpleProjectMock: Project = {
  synthTree: {
    nodes: {
      output: {
        type: 'output',
        position: { x: 0, y: 0 },
        params: {},
        color: 'zinc',
        number: 0,
      },
      generator: {
        type: 'generator',
        position: { x: -200, y: -50 },
        params: { waveShape: 'sawtooth', release: 1 },
        color: 'emerald',
        number: 1,
      },
      oscillator: {
        type: 'oscillator',
        position: { x: -400, y: 0 },
        params: {},
        color: 'yellow',
        number: 2,
      },
      reverb: {
        type: 'reverb',
        position: { x: -200, y: 50 },
        params: {},
        color: 'orange',
        number: 3,
      },
    },
    edges: {
      main: {
        source: { node: 'generator', socket: 0 },
        target: { node: 'output', socket: 0 },
      },
      oscToReverb: {
        source: { node: 'oscillator', socket: 0 },
        target: { node: 'reverb', socket: 0 },
      },
      reverbToOutput: {
        source: { node: 'reverb', socket: 0 },
        target: { node: 'output', socket: 0 },
      },
    },
  },
  musicSheet: {
    timeSignature: [4, 4],
    beatsPerMinute: 125,
    endingNote: 2,
    notes: {
      'note-1': { synth: 'generator', pitch: 'c4', time: 0, duration: 0.25 },
      'note-2': { synth: 'generator', pitch: 'e4', time: 0.25, duration: 0.25 },
      'note-3': { synth: 'generator', pitch: 'd4', time: 0.5, duration: 0.25 },
      'note-4': { synth: 'generator', pitch: 'f4', time: 0.75, duration: 0.25 },
    },
  },
}
