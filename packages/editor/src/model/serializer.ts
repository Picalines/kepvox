import { CurveSynthParam, EnumSynthParam, Notes, type SynthNode, SynthTime } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { attach, combine, createEffect, createStore, sample, scopeBind } from 'effector'
import { and, debounce, readonly, reset } from 'patronum'
import { TRACKED_EDITOR_ACTIONS } from './action'
import type { EditorGate } from './gate'
import type { HistoryStore } from './history'
import type { MusicSheetStore } from './music-sheet'
import type { Project } from './project'
import type { SynthTreeStore } from './synth-tree'

type Params = {
  gate: EditorGate
  history: HistoryStore
  synthTree: SynthTreeStore
  musicSheet: MusicSheetStore
}

export const createSerializer = createFactory((params: Params) => {
  const { gate, history, synthTree } = params

  const $isLoaded = createStore(false)
  const $isDirty = createStore(false)

  const deserializeFx = createEffect((project: Project) => {
    const dispatch = scopeBind(history.dispatched)

    for (const [nodeId, node] of Object.entries(project.synthTree.nodes)) {
      const { type, position } = node
      dispatch({ action: 'synth-node-created', id: nodeId, type, position })
      for (const [param, value] of Object.entries(node.params)) {
        dispatch({ action: 'synth-node-param-set', id: nodeId, param, value })
      }
    }

    for (const [edgeId, edge] of Object.entries(project.synthTree.edges)) {
      const { source, target } = edge
      dispatch({ action: 'synth-edge-created', id: edgeId, source, target })
    }

    for (const [noteId, note] of Object.entries(project.musicSheet.notes)) {
      const { synth: synthId, time, duration, pitch } = note
      dispatch({
        action: 'sheet-note-created',
        id: noteId,
        synthId,
        time: SynthTime.fromNotes(Notes.orClamp(time)),
        duration: SynthTime.fromNotes(Notes.orClamp(duration)),
        pitch,
      })
    }
  })

  const serializeFx = attach({
    source: { nodes: synthTree.$nodes, edges: synthTree.$edges, editorProps: gate.state },
    effect: ({ nodes, edges, editorProps }) => {
      if (!editorProps.onSerialized) {
        return
      }

      const project: Project = {
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
      }

      editorProps.onSerialized(project)
    },
  })

  reset({
    clock: synthTree.initialized,
    target: [$isLoaded, $isDirty],
  })

  sample({
    clock: synthTree.initialized,
    source: gate.state,
    target: deserializeFx,
    fn: ({ initialProject }) => initialProject,
  })

  sample({
    clock: deserializeFx.done,
    target: $isLoaded,
    fn: () => true,
  })

  const trackedActionDispatched = sample({
    clock: history.dispatched,
    filter: ({ action }) => TRACKED_EDITOR_ACTIONS.includes(action),
  })

  const $changeTimeout = combine(gate.status, gate.state, (isOpened, props) =>
    isOpened ? props.serializationTimeout : -1,
  )

  sample({
    clock: trackedActionDispatched,
    filter: and(
      $isLoaded,
      $changeTimeout.map(t => t >= 0),
    ),
    target: $isDirty,
    fn: () => true,
  })

  sample({
    clock: debounce($isDirty, $changeTimeout),
    filter: $isDirty,
    target: serializeFx,
  })

  sample({
    clock: serializeFx.done,
    target: $isDirty,
    fn: () => false,
  })

  sample({
    clock: serializeFx.failData,
    fn: error => {
      console.error('editor serialization error', error)
    },
  })

  return {
    $isLoaded: readonly($isLoaded),
    $isDirty: readonly($isDirty),
  }
})
