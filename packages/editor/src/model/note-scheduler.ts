import { GeneratorSynthNode, Pitch, Time } from '@repo/synth'
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
          node.synthNode.muteAt(Time.start)
        }
      }

      const sortedNotes = [...notes.values()].sort((a, b) => a.time.notes - b.time.notes)

      for (const note of sortedNotes) {
        const synth = nodes.get(note.synthId)?.synthNode

        if (synth instanceof GeneratorSynthNode) {
          const { hertz } = Pitch[note.pitch]
          synth.attackAt(note.time, hertz)
          synth.releaseAt(note.time.add(note.duration), hertz)
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
    target: spread({ stopped: playback.stopped, playhead: playback.userSetPlayhead }),
    fn: () => ({ stopped: undefined, playhead: Time.start }),
  })

  return {
    userToggledPlayback,
    userStoppedPlayback,
  }
})
