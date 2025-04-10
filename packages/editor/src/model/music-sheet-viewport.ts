import { step } from '@repo/common/math'
import { Notes, type PitchNotation, SynthTime } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { combine, createEvent, createStore, sample } from 'effector'
import { nanoid } from 'nanoid'
import { readonly } from 'patronum'
import type { ActionPayload } from './action'
import type { HistoryStore } from './history'
import type { SynthTreeStore } from './synth-tree'

export type MusicSheetPreviewStore = ReturnType<typeof createMusicSheetViewport>

export type NotePreview = {
  pitch: PitchNotation
  time: SynthTime
  duration: SynthTime
}

const DEFAULT_PREVIEW_DURATION = SynthTime.quarter
const MIN_PREVIEW_DURATION = SynthTime.sixteenth

type Params = {
  history: HistoryStore
  synthTree: SynthTreeStore
}

export const createMusicSheetViewport = createFactory((params: Params) => {
  const { history, synthTree } = params

  const $timeSnapping = createStore(SynthTime.quarter)

  const $notePreviewPosition = createStore<Pick<NotePreview, 'pitch' | 'time'> | null>(null)
  const $notePreviewDuration = createStore(DEFAULT_PREVIEW_DURATION)

  const $notePreview = combine(
    synthTree.$activeNode,
    $notePreviewPosition,
    $notePreviewDuration,
    (activeNode, position, duration) => (activeNode && position ? { ...position, duration } : null),
  )

  const notePreviewMoved = createEvent<{ pitch: PitchNotation; time: SynthTime }>()
  const notePreviewStretched = createEvent<{ until: SynthTime }>()
  const notePreviewHidden = createEvent()
  const noteRequestedAtPreview = createEvent()

  sample({
    clock: notePreviewMoved,
    source: $timeSnapping,
    target: $notePreviewPosition,
    fn: (snapping, { pitch, time }) => ({
      pitch,
      time: SynthTime.fromNotes(Notes.orClamp(step(time.toNotes(), snapping.toNotes()))),
    }),
  })

  sample({
    clock: notePreviewHidden,
    target: $notePreviewPosition,
    fn: () => null,
  })

  sample({
    clock: notePreviewStretched,
    source: { position: $notePreviewPosition, duration: $notePreviewDuration, snapping: $timeSnapping },
    target: $notePreviewDuration,
    fn: ({ position, duration, snapping }, { until }) => {
      const { time } = position ?? {}
      if (!time) {
        return duration
      }

      return MIN_PREVIEW_DURATION.max(
        SynthTime.fromNotes(Notes.orClamp(step(until.sub(time).toNotes(), snapping.toNotes()))),
      )
    },
  })

  sample({
    clock: noteRequestedAtPreview,
    source: combine($notePreview, synthTree.$activeNode, (preview, activeNode) =>
      preview && activeNode ? { preview, activeNode } : null,
    ),
    filter: Boolean,
    target: history.dispatched,
    fn: ({ preview, activeNode }) => {
      const { pitch, time, duration } = preview
      const { id: synthId } = activeNode
      return { action: 'sheet-note-created', id: nanoid(), synthId, pitch, time, duration } satisfies ActionPayload
    },
  })

  return {
    $notePreview: readonly($notePreview),
    notePreviewMoved,
    notePreviewStretched,
    notePreviewHidden,
    noteRequestedAtPreview,
  }
})
