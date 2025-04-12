import { CurveSynthParam, EnumSynthParam, Notes, NumberSynthParam, type SynthNode, SynthTime } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { attach, combine, createEffect, createStore, sample, scopeBind } from 'effector'
import { and, debounce, readonly, reset } from 'patronum'
import { TRACKED_EDITOR_ACTIONS } from './action'
import type { EditorGate } from './gate'
import type { HistoryStore } from './history'
import type { MusicSheetStore } from './music-sheet'
import type { Project } from './project'
import type { SynthTreeStore } from './synth-tree'

export type SerializerStore = ReturnType<typeof createSerializer>

type Params = {
  gate: EditorGate
  history: HistoryStore
  synthTree: SynthTreeStore
  musicSheet: MusicSheetStore
}

export const createSerializer = createFactory((params: Params) => {
  const { gate, history, synthTree, musicSheet } = params

  const $isLoaded = createStore(false)
  const $isDirty = createStore(false)

  const deserializeFx = createEffect((project: Project) => {
    const dispatch = scopeBind(history.dispatched)

    dispatch({ action: 'ending-note-set', time: SynthTime.fromNotes(Notes.orClamp(project.musicSheet.endingNote)) })

    for (const [nodeId, node] of Object.entries(project.synthTree.nodes)) {
      const { type, position, number, color } = node
      dispatch({ action: 'synth-node-created', id: nodeId, type, position, number, color })
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
    source: {
      nodes: synthTree.$nodes,
      edges: synthTree.$edges,
      notes: musicSheet.$notes,
      endTime: musicSheet.$endTime,
      editorProps: gate.state,
    },
    effect: ({ nodes, edges, notes, endTime, editorProps }) => {
      if (!editorProps.onSerialized) {
        return
      }

      const project: Project = {
        synthTree: {
          nodes: Object.fromEntries(
            nodes.entries().map(([id, { type, position, synthNode, number, color }]) => [
              id,
              {
                type,
                position,
                number,
                color,
                params: Object.fromEntries(
                  Object.keys(synthNode).flatMap(key => {
                    const param = synthNode[key as keyof SynthNode]

                    if (param instanceof NumberSynthParam) {
                      return [[key, param.value]]
                    }

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
        musicSheet: {
          endingNote: endTime.toNotes(),
          notes: Object.fromEntries(
            notes.entries().map(([id, { synthId, time, duration, pitch }]) => [
              id,
              {
                synth: synthId,
                time: time.toNotes(),
                duration: duration.toNotes(),
                pitch,
              },
            ]),
          ),
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
