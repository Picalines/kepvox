import type { Project } from '#model'

export const simpleProjectMock: Project = {
  synthTree: {
    nodes: {
      out: {
        type: 'output',
        position: { x: 0, y: 0 },
        params: {},
      },
      gen: {
        type: 'generator',
        position: { x: -200, y: 0 },
        params: { waveShape: 'sawtooth', release: 1 },
      },
    },
    edges: {
      main: {
        source: { node: 'gen', socket: 0 },
        target: { node: 'out', socket: 0 },
      },
    },
  },
}
