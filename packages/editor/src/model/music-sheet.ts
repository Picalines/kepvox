import { type PitchNotation, Range, Time, TimeSignature } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { createStore, sample } from 'effector'
import { attach } from 'effector/effector.umd'
import { produce } from 'immer'
import { readonly, reset, spread } from 'patronum'
import type { ActionPayload } from './action'
import type { HistoryStore } from './history'
import type { PlaybackStore } from './playback'
import type { NodeId, NoteId } from './project'
import type { SynthTreeStore } from './synth-tree'

export type Note = {
  id: NoteId
  synthId: NodeId
  time: Time
  duration: Time
  pitch: PitchNotation
  selected: boolean
}

export type MusicSheetStore = ReturnType<typeof createMusicSheet>

type Params = {
  history: HistoryStore
  synthTree: SynthTreeStore
  playback: PlaybackStore
}

const BEATS_PER_MINUTE_RANGE = new Range(1, 1_000)

export const createMusicSheet = createFactory((params: Params) => {
  const { history, synthTree, playback } = params

  const $notes = createStore<ReadonlyMap<NoteId, Note>>(new Map())
  const $timeSignature = createStore(new TimeSignature(4, 4))
  const $beatsPerMinute = createStore(125)
  const $endTime = createStore(Time.note.repeat(5))

  reset({
    clock: [synthTree.initialized],
    target: [$notes, $timeSignature, $endTime],
  })

  const setTempoFx = attach({
    source: { context: playback.$context, timeSignature: $timeSignature, beatsPerMinute: $beatsPerMinute },
    effect: ({ context, timeSignature, beatsPerMinute }) => {
      context?.secondsPerNote.setValueAt(Time.start, timeSignature.bpmToSecondsPerNote(beatsPerMinute))
    },
  })

  const createNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'sheet-note-create',
  })

  sample({
    clock: createNoteDispatched,
    source: { notes: $notes, nodes: synthTree.$nodes },
    target: $notes,
    fn: ({ notes, nodes }, { id, synthId, time, duration, pitch }) =>
      produce(notes, draft => {
        if (!notes.has(id) && nodes.has(synthId)) {
          draft.set(id, { id, synthId, time, duration, pitch, selected: false })
        }
      }),
  })

  const moveNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'sheet-note-move',
  })

  sample({
    clock: moveNoteDispatched,
    source: $notes,
    target: $notes,
    fn: (notes, { id, to: { time, pitch } }) =>
      produce(notes, draft => {
        const note = draft.get(id)
        if (note) {
          note.time = time
          note.pitch = pitch
        }
      }),
  })

  const deleteNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'sheet-note-delete',
  })

  sample({
    clock: deleteNoteDispatched,
    source: $notes,
    target: $notes,
    fn: (notes, { id }) =>
      produce(notes, draft => {
        draft.delete(id)
      }),
  })

  const selectNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'sheet-note-select',
  })

  sample({
    clock: selectNoteDispatched,
    source: $notes,
    target: $notes,
    fn: (notes, { id, selected }) =>
      produce(notes, draft => {
        const note = draft.get(id)
        if (note) {
          note.selected = selected
        }
      }),
  })

  const setTimeSignatureDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'time-signature-set',
  })

  sample({
    clock: setTimeSignatureDispatched,
    filter: playback.$isIdle,
    target: $timeSignature,
    fn: ({ timeSignature }) => timeSignature,
  })

  const setBeatsPerMinuteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'beats-per-minute-set',
  })

  sample({
    clock: setBeatsPerMinuteDispatched,
    filter: playback.$isIdle,
    target: $beatsPerMinute,
    fn: ({ beatsPerMinute }) => BEATS_PER_MINUTE_RANGE.clamp(beatsPerMinute),
  })

  sample({
    clock: [$timeSignature, $beatsPerMinute],
    target: setTempoFx,
  })

  const setEndingNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'ending-note-set',
  })

  sample({
    clock: setEndingNoteDispatched,
    filter: playback.$isIdle,
    target: spread({ endTime: $endTime, playDuration: playback.durationSet }),
    fn: ({ time }) => ({ endTime: time, playDuration: time }),
  })

  return {
    $beatsPerMinute: readonly($beatsPerMinute),
    $endTime: readonly($endTime),
    $notes: readonly($notes),
    $timeSignature: readonly($timeSignature),
  }
})
