import {
  CurveSynthParam,
  EnumSynthParam,
  Notes,
  NumberSynthParam,
  type SynthNode,
  Time,
  TimeSignature,
} from '@repo/synth'
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

    dispatch({ action: 'time-signature-set', timeSignature: new TimeSignature(...project.musicSheet.timeSignature) })
    dispatch({ action: 'beats-per-minute-set', beatsPerMinute: project.musicSheet.beatsPerMinute })
    dispatch({ action: 'ending-note-set', time: Time.atNote(Notes.orClamp(project.musicSheet.endingNote)) })

    for (const [nodeId, node] of Object.entries(project.synthTree.nodes)) {
      const { type, position, number, color } = node
      dispatch({ action: 'synth-node-create', id: nodeId, type, position, number, color })
      for (const [param, value] of Object.entries(node.params)) {
        dispatch({ action: 'synth-node-param-set', id: nodeId, param, value })
      }
    }

    for (const [edgeId, edge] of Object.entries(project.synthTree.edges)) {
      const { source, target } = edge
      dispatch({ action: 'synth-edge-create', id: edgeId, source, target })
    }

    for (const [noteId, note] of Object.entries(project.musicSheet.notes)) {
      const { synth: synthId, time, duration, pitch } = note
      dispatch({
        action: 'sheet-note-create',
        id: noteId,
        synthId,
        time: Time.atNote(Notes.orClamp(time)),
        duration: Time.atNote(Notes.orClamp(duration)),
        pitch,
      })
    }
  })

  const serializeFx = attach({
    source: {
      nodes: synthTree.$nodes,
      edges: synthTree.$edges,
      notes: musicSheet.$notes,
      timeSignature: musicSheet.$timeSignature,
      beatsPerMinute: musicSheet.$beatsPerMinute,
      endTime: musicSheet.$endTime,
      editorProps: gate.$props,
    },
    effect: ({ nodes, edges, notes, timeSignature, beatsPerMinute, endTime, editorProps }) => {
      if (!editorProps || editorProps.readonly || !editorProps.onSerialized) {
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
          timeSignature: [timeSignature.beatsInBar, timeSignature.beatsInNote],
          beatsPerMinute,
          endingNote: endTime.notes,
          notes: Object.fromEntries(
            notes.entries().map(([id, { synthId, time, duration, pitch }]) => [
              id,
              {
                synth: synthId,
                time: time.notes,
                duration: duration.notes,
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
    source: gate.$props,
    filter: Boolean,
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

  const $changeTimeout = combine(gate.$isOpened, gate.$props, (isOpened, props) =>
    isOpened && props ? props.serializationTimeout : -1,
  )

  const $serializationHandlerExists = combine(
    gate.$isOpened,
    gate.$props,
    (isOpened, props) => isOpened && Boolean(props?.onSerialized),
  )

  sample({
    clock: trackedActionDispatched,
    filter: and(
      $serializationHandlerExists,
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
