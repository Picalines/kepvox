import { type PitchNotation, SynthTime } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { createStore, sample } from 'effector'
import { not, readonly, reset, spread } from 'patronum'
import type { ActionPayload } from './action'
import type { HistoryStore } from './history'
import type { PlaybackStore } from './playback'
import type { NodeId, NoteId } from './project'
import type { SynthTreeStore } from './synth-tree'

export type Note = {
  id: NoteId
  synthId: NodeId
  time: SynthTime
  duration: SynthTime
  pitch: PitchNotation
  selected: boolean
}

export type MusicSheetStore = ReturnType<typeof createMusicSheet>

type Params = {
  history: HistoryStore
  synthTree: SynthTreeStore
  playback: PlaybackStore
}

export const createMusicSheet = createFactory((params: Params) => {
  const { history, synthTree, playback } = params

  const $notes = createStore<ReadonlyMap<NoteId, Note>>(new Map())
  const $endTime = createStore(SynthTime.note.repeat(5))

  reset({
    clock: [synthTree.initialized],
    target: [$notes, $endTime],
  })

  const createNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'sheet-note-created',
  })

  sample({
    clock: createNoteDispatched,
    source: { notes: $notes, nodes: synthTree.$nodes },
    target: $notes,
    fn: ({ notes, nodes }, { id, synthId, time, duration, pitch }) => {
      if (notes.has(id) || !nodes.has(synthId)) {
        return notes
      }

      const newNotes = new Map(notes)
      newNotes.set(id, { id, synthId, time, duration, pitch, selected: false })
      return newNotes
    },
  })

  const moveNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'sheet-note-moved',
  })

  sample({
    clock: moveNoteDispatched,
    source: $notes,
    target: $notes,
    fn: (notes, { id, to: { time, pitch } }) => {
      const note = notes.get(id)
      if (!note) {
        return notes
      }

      const newNotes = new Map(notes)
      newNotes.set(id, { ...note, time, pitch })
      return newNotes
    },
  })

  const deleteNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'sheet-note-deleted',
  })

  sample({
    clock: deleteNoteDispatched,
    source: $notes,
    target: $notes,
    fn: (notes, { id }) => {
      if (!notes.has(id)) {
        return notes
      }

      const newNotes = new Map(notes)
      newNotes.delete(id)
      return newNotes
    },
  })

  const selectNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'sheet-note-selected',
  })

  sample({
    clock: selectNoteDispatched,
    source: $notes,
    target: $notes,
    fn: (notes, { id, selected }) => {
      const note = notes.get(id)
      if (!note) {
        return notes
      }

      const newNotes = new Map(notes)
      newNotes.set(id, { ...note, selected })
      return newNotes
    },
  })

  const setEndingNoteDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'ending-note-set',
  })

  sample({
    clock: setEndingNoteDispatched,
    filter: not(playback.$isPlaying),
    target: spread({ endTime: $endTime, playDuration: playback.durationSet }),
    fn: ({ time }) => ({ endTime: time, playDuration: time }),
  })

  return {
    $notes: readonly($notes),
    $endTime: readonly($endTime),
  }
})
