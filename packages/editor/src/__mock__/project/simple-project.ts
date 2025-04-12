import type { Project } from '#model'

export const simpleProjectMock: Project = {
  synthTree: {
    nodes: {
      out: {
        type: 'output',
        position: { x: 0, y: 0 },
        params: {},
        color: 'zinc',
        number: 0,
      },
      gen: {
        type: 'generator',
        position: { x: -200, y: 0 },
        params: { waveShape: 'sawtooth', release: 1 },
        color: 'emerald',
        number: 1,
      },
    },
    edges: {
      main: {
        source: { node: 'gen', socket: 0 },
        target: { node: 'out', socket: 0 },
      },
    },
  },
  musicSheet: {
    endingNote: 2,
    notes: {
      'note-1': { synth: 'gen', pitch: 'C4', time: 0, duration: 0.25 },
      'note-2': { synth: 'gen', pitch: 'E4', time: 0.25, duration: 0.25 },
      'note-3': { synth: 'gen', pitch: 'D4', time: 0.5, duration: 0.25 },
      'note-4': { synth: 'gen', pitch: 'F4', time: 0.75, duration: 0.25 },
    },
  },
}
