import type { Project } from '@repo/editor'

export const defaultProject: Project = {
  synthTree: {
    nodes: {
      generator: {
        type: 'generator',
        color: 'emerald',
        number: 2,
        position: { x: -100, y: 0 },
        params: {},
      },
      output: {
        type: 'output',
        number: 1,
        color: 'zinc',
        position: { x: 100, y: 0 },
        params: {},
      },
    },
    edges: {
      genToOutput: {
        source: { node: 'generator', socket: 0 },
        target: { node: 'output', socket: 0 },
      },
    },
  },
  musicSheet: {
    beatsPerMinute: 120,
    timeSignature: [4, 4],
    endingNote: 4,
    notes: {},
  },
}
