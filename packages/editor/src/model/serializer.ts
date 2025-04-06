import { CurveSynthParam, EnumSynthParam, type SynthNode } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { combine, createEffect, createStore, sample, scopeBind } from 'effector'
import { and, debounce, readonly, reset } from 'patronum'
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
  const $haveChanged = createStore(false)
  const $serializedProject = createStore<Project | null>(null)
  const $serializationTimeout = createStore(-1)

  const deserializeFx = createEffect((project: Project) => {
    const dispatch = scopeBind(history.dispatched)

    for (const [nodeId, node] of Object.entries(project.synthTree.nodes)) {
      dispatch({
        action: 'synth-node-created',
        id: nodeId,
        type: node.type,
        position: node.position,
      })

      for (const [param, value] of Object.entries(node.params)) {
        dispatch({ action: 'synth-node-param-set', id: nodeId, param, value })
      }
    }

    for (const [edgeId, edge] of Object.entries(project.synthTree.edges)) {
      dispatch({
        action: 'synth-edge-created',
        id: edgeId,
        source: edge.source,
        target: edge.target,
      })
    }
  })

  reset({
    clock: synthTree.initialized,
    target: [$isDeserialized, $haveChanged],
  })

  sample({
    clock: synthTree.initialized,
    source: gate.state,
    target: deserializeFx,
    fn: ({ initialProject }) => initialProject,
  })

  sample({
    clock: gate.status,
    filter: gate.status,
    source: gate.state,
    target: $serializationTimeout,
    fn: ({ serializationTimeout }) => serializationTimeout,
  })

  sample({
    clock: deserializeFx.done,
    target: $isDeserialized,
    fn: () => true,
  })

  const projectChanged = sample({
    clock: combine({ nodes: synthTree.$nodes, edges: synthTree.$edges }),
    filter: and(
      $isDeserialized,
      $serializationTimeout.map(t => t >= 0),
    ),
  })

  sample({
    clock: projectChanged,
    target: $serializedProject,
    fn: () => null,
  })

  sample({
    clock: projectChanged,
    target: $haveChanged,
    fn: () => true,
  })

  sample({
    clock: debounce(projectChanged, $serializationTimeout),
    target: $serializedProject,
    fn: ({ nodes, edges }) => ({
      synthTree: {
        nodes: Object.fromEntries(
          nodes.entries().map(([id, { type, position, synthNode }]) => [
            id,
            {
              type,
              position,
              params: Object.fromEntries(
                Object.keys(synthNode).flatMap(key => {
                  const param = synthNode[key as keyof SynthNode]

                  if (param instanceof CurveSynthParam) {
                    return [[key, param.initialValue]]
                  }

                  if (param instanceof EnumSynthParam) {
                    return [[key, param.value]]
                  }

                  return []
                }),
              ),
            },
          ]),
        ),
        edges: Object.fromEntries(edges.entries().map(([id, { source, target }]) => [id, { source, target }])),
      },
    }),
  })

  return {
    $isDeserialized: readonly($isDeserialized),
    $serializedProject: readonly($serializedProject),
    $haveChanged: readonly($haveChanged),
  }
})
