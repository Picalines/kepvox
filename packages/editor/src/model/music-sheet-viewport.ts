import { step } from '@repo/common/math'
import { GeneratorSynthNode, Notes, type PitchNotation, Time } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { combine, createEvent, createStore, sample } from 'effector'
import { nanoid } from 'nanoid'
import { readonly } from 'patronum'
import type { ActionPayload } from './action'
import type { EditorGate } from './gate'
import type { HistoryStore } from './history'
import type { SynthTreeStore } from './synth-tree'

export type MusicSheetPreviewStore = ReturnType<typeof createMusicSheetViewport>

export type NotePreview = {
  pitch: PitchNotation
  time: Time
  duration: Time
}

export type SheetViewportPosition = {
  x: number
  y: number
  zoom: number
}

const DEFAULT_PREVIEW_DURATION = Time.n4
const MIN_PREVIEW_DURATION = Time.n16

type Params = {
  gate: EditorGate
  history: HistoryStore
  synthTree: SynthTreeStore
}

export const createMusicSheetViewport = createFactory((params: Params) => {
  const { gate, history, synthTree } = params

  const $position = createStore<SheetViewportPosition>({ x: 0, y: 0, zoom: 1 })
  const $timeSnapping = createStore(Time.n4)
  const $notePreviewPosition = createStore<Pick<NotePreview, 'pitch' | 'time'> | null>(null)
  const $notePreviewDuration = createStore(DEFAULT_PREVIEW_DURATION)

  const $notePreview = combine(
    gate.$isReadonly,
    synthTree.$activeNode,
    $notePreviewPosition,
    $notePreviewDuration,
    (isReadonly, activeNode, position, duration) =>
      !isReadonly && activeNode?.synthNode instanceof GeneratorSynthNode && position ? { ...position, duration } : null,
  )

  const userMovedSheet = createEvent<SheetViewportPosition>()
  const userMovedNotePreview = createEvent<{ pitch: PitchNotation; time: Time }>()
  const userStretchedNotePreview = createEvent<{ until: Time }>()
  const userHidNotePreview = createEvent()
  const userRequestedANote = createEvent()

  sample({ clock: userMovedSheet, target: $position })

  sample({
    clock: userMovedNotePreview,
    source: $timeSnapping,
    target: $notePreviewPosition,
    fn: (snapping, { pitch, time }) => ({
      pitch,
      time: Time.atNote(Notes.orClamp(step(time.toNotes(), snapping.toNotes()))),
    }),
  })

  sample({
    clock: userHidNotePreview,
    target: $notePreviewPosition,
    fn: () => null,
  })

  sample({
    clock: userStretchedNotePreview,
    source: { position: $notePreviewPosition, duration: $notePreviewDuration, snapping: $timeSnapping },
    target: $notePreviewDuration,
    fn: ({ position, duration, snapping }, { until }) => {
      const { time } = position ?? {}
      if (!time) {
        return duration
      }

      const cellWidth = snapping.toNotes()
      const snappedNotes = Math.ceil(until.sub(time).toNotes() / cellWidth) * cellWidth
      return MIN_PREVIEW_DURATION.max(Time.atNote(Notes.orClamp(snappedNotes)))
    },
  })

  sample({
    clock: userRequestedANote,
    source: combine($notePreview, synthTree.$activeNode, (preview, activeNode) =>
      preview && activeNode ? { preview, activeNode } : null,
    ),
    filter: Boolean,
    target: history.dispatched,
    fn: ({ preview, activeNode }) => {
      const { pitch, time, duration } = preview
      const { id: synthId } = activeNode
      return { action: 'sheet-note-create', id: nanoid(), synthId, pitch, time, duration } satisfies ActionPayload
    },
  })

  return {
    $notePreview: readonly($notePreview),
    $position: readonly($position),
    userHidNotePreview,
    userMovedNotePreview,
    userMovedSheet,
    userRequestedANote,
    userStretchedNotePreview,
  }
})
