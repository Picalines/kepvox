import { invoke } from '@withease/factories'
import { Gate } from './gate'
import { createHistory } from './history'
import { createMusicSheet } from './music-sheet'
import { createPlayback } from './playback'
import { createSerializer } from './serializer'
import { createSynthNodePanel } from './synth-node-panel'
import { createSynthTree } from './synth-tree'

const history = invoke(createHistory)

const playback = invoke(createPlayback, { gate: Gate })

const synthTree = invoke(createSynthTree, { history, playback })

const synthNodePanel = invoke(createSynthNodePanel, { history, synthTree })

const musicSheet = invoke(createMusicSheet, { history, synthTree })

const serializer = invoke(createSerializer, { gate: Gate, history, synthTree, musicSheet })

const { dispatched: actionDispatched } = history

const {
  $hasAudioPermission,
  $isPlaying,
  $progress: $playbackProgress,
  audioPermissionGranted,
  playheadSet,
  started: playbackStarted,
  stopped: playbackStopped,
} = playback

const { $edges: $synthEdges, $nodes: $synthNodes } = synthTree

const { $activeNodeId, $nodeParams } = synthNodePanel

const { $notes: $sheetNotes } = musicSheet

const { $isLoaded, $isDirty } = serializer

export {
  $activeNodeId,
  $hasAudioPermission,
  $isDirty,
  $isLoaded,
  $isPlaying,
  $nodeParams,
  $playbackProgress,
  $sheetNotes,
  $synthEdges,
  $synthNodes,
  Gate,
  actionDispatched,
  audioPermissionGranted,
  playbackStarted,
  playbackStopped,
  playheadSet,
}
