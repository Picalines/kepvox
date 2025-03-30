import { createFactory } from '@withease/factories'
import { combine, createEffect, createStore, sample, scopeBind } from 'effector'
import { debounce, readonly } from 'patronum'
import type { EditorGate } from './gate'
import type { HistoryStore } from './history'
import type { Project } from './project'
import type { SynthTreeStore } from './synth-tree'

type Params = {
  gate: EditorGate
  history: HistoryStore
  synthTree: SynthTreeStore
}

export const createSerializer = createFactory((params: Params) => {
  const { gate, history, synthTree } = params

  const $isDeserialized = createStore(false)
  const $serializedProject = createStore<Project | null>(null)

  const deserializeFx = createEffect((project: Project) => {
    const dispatch = scopeBind(history.dispatched)

    for (const [nodeId, node] of Object.entries(project.synthTree.nodes)) {
      dispatch({
        action: 'synth-tree-node-created',
        id: nodeId,
        type: node.type,
        position: node.position,
      })
    }

    for (const [edgeId, edge] of Object.entries(project.synthTree.edges)) {
      dispatch({
        action: 'synth-tree-edge-created',
        id: edgeId,
        source: edge.source,
        target: edge.target,
      })
    }
  })

  sample({
    clock: synthTree.initialized,
    source: gate.state,
    target: deserializeFx,
    fn: ({ initialProject }) => initialProject,
  })

  sample({
    clock: deserializeFx.done,
    target: $isDeserialized,
    fn: () => true,
  })

  const projectChanged = sample({
    clock: combine({ nodes: synthTree.$nodes, edges: synthTree.$edges }),
    filter: $isDeserialized,
  })

  sample({
    clock: debounce(projectChanged, 3_000),
    target: $serializedProject,
    fn: ({ nodes, edges }) => {
      return {
        synthTree: {
          nodes: Object.fromEntries(nodes.entries().map(([id, { type, position }]) => [id, { type, position }])),
          edges: Object.fromEntries(edges.entries().map(([id, { source, target }]) => [id, { source, target }])),
        },
      }
    },
  })

  return {
    $isDeserialized: readonly($isDeserialized),
    $serializedProject: readonly($serializedProject),
  }
})
