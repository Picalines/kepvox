import type { Project } from '#model'

export const simpleProjectMock: Project = {
  synthTree: {
    nodes: {
      out: {
        type: 'output',
        position: { x: 0, y: 0 },
      },
      gen: {
        type: 'generator',
        position: { x: -200, y: 0 },
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
