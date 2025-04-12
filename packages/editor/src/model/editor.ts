import { invoke } from '@withease/factories'
import { Gate } from './gate'
import { createHistory } from './history'
import { createMusicSheet } from './music-sheet'
import { createMusicSheetViewport } from './music-sheet-viewport'
import { createPlayback } from './playback'
import { createSerializer } from './serializer'
import { createSynthNodePanel } from './synth-node-panel'
import { createSynthTree } from './synth-tree'
import { createSynthTreeViewport } from './synth-tree-viewport'

const history = invoke(createHistory)

const playback = invoke(createPlayback, { gate: Gate })

const synthTree = invoke(createSynthTree, { history, playback })

const synthNodePanel = invoke(createSynthNodePanel, { history, synthTree })

const musicSheet = invoke(createMusicSheet, { history, synthTree, playback })

const musicSheetViewport = invoke(createMusicSheetViewport, { history, synthTree })

const serializer = invoke(createSerializer, { gate: Gate, history, synthTree, musicSheet })

const synthTreeViewport = invoke(createSynthTreeViewport, { history, synthTree, serializer })

const { dispatched: actionDispatched } = history

const {
  $hasAudioPermission,
  $isPlaying,
  $playhead,
  audioPermissionGranted,
  playheadSet,
  started: playbackStarted,
  stopped: playbackStopped,
} = playback

const { $edges: $synthEdges, $nodes: $synthNodes } = synthTree

const { $activeNodeId, $nodeParams } = synthNodePanel

const { $notes: $sheetNotes, $endTime } = musicSheet

const {
  $notePreview,
  $position: $sheetPosition,
  moved: sheetMoved,
  notePreviewHidden,
  notePreviewMoved,
  notePreviewStretched,
  noteRequestedAtPreview,
} = musicSheetViewport

const { $isLoaded, $isDirty } = serializer

const { $nodeCreationDialogShown, nodePositionSelected, nodeTypeSelected, nodeCreationCancelled } = synthTreeViewport

export {
  $activeNodeId,
  $endTime,
  $hasAudioPermission,
  $isDirty,
  $isLoaded,
  $isPlaying,
  $nodeCreationDialogShown,
  $nodeParams,
  $notePreview,
  $playhead,
  $sheetNotes,
  $sheetPosition,
  $synthEdges,
  $synthNodes,
  Gate,
  actionDispatched,
  audioPermissionGranted,
  nodeCreationCancelled,
  nodePositionSelected,
  nodeTypeSelected,
  notePreviewHidden,
  notePreviewMoved,
  notePreviewStretched,
  noteRequestedAtPreview,
  playbackStarted,
  playbackStopped,
  playheadSet,
  sheetMoved,
}
