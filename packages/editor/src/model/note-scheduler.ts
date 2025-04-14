import { GeneratorSynthNode, Pitch, SynthTime } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { attach, createEvent, sample } from 'effector'
import { condition, spread } from 'patronum'
import type { MusicSheetStore } from './music-sheet'
import type { PlaybackStore } from './playback'
import type { SynthTreeStore } from './synth-tree'

export type NoteSchedulerStore = ReturnType<typeof createNoteScheduler>

type Params = {
  musicSheet: MusicSheetStore
  synthTree: SynthTreeStore
  playback: PlaybackStore
}

export const createNoteScheduler = createFactory((params: Params) => {
  const { musicSheet, synthTree, playback } = params

  const userToggledPlayback = createEvent()
  const userStoppedPlayback = createEvent()

  const scheduleFx = attach({
    source: { notes: musicSheet.$notes, nodes: synthTree.$nodes },
    effect: ({ notes, nodes }) => {
      for (const node of nodes.values()) {
        if (node.synthNode instanceof GeneratorSynthNode) {
          node.synthNode.muteAt(SynthTime.start)
        }
      }

      const sortedNotes = [...notes.values()].sort((a, b) => a.time.toNotes() - b.time.toNotes())

      for (const note of sortedNotes) {
        const synth = nodes.get(note.synthId)?.synthNode

        if (synth instanceof GeneratorSynthNode) {
          const frequency = Pitch.frequency(note.pitch)
          synth.attackAt(note.time, frequency)
          synth.releaseAt(note.time.add(note.duration), frequency)
        }
      }
    },
  })

  condition({
    source: userToggledPlayback,
    if: playback.$isIdle,
    then: scheduleFx,
    else: playback.stopped,
  })

  sample({
    clock: scheduleFx.done,
    target: playback.started,
  })

  sample({
    clock: userStoppedPlayback,
    target: spread({ stopped: playback.stopped, playhead: playback.playheadSet }),
    fn: () => ({ stopped: undefined, playhead: SynthTime.start }),
  })

  return {
    userToggledPlayback,
    userStoppedPlayback,
  }
})
