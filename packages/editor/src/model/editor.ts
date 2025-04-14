import { invoke } from '@withease/factories'
import { Gate } from './gate'
import { createHistory } from './history'
import { createMusicSheet } from './music-sheet'
import { createMusicSheetViewport } from './music-sheet-viewport'
import { createNoteScheduler } from './note-scheduler'
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

const noteScheduler = invoke(createNoteScheduler, { musicSheet, synthTree, playback })

const { dispatched: actionDispatched } = history

const { $hasAudioPermission, $isPlaying, $playhead, userGrantedAudioPermission } = playback

const { $edges: $synthEdges, $nodes: $synthNodes } = synthTree

const { $activeNodeId, $nodeParams } = synthNodePanel

const { $notes: $sheetNotes, $endTime } = musicSheet

const {
  $notePreview,
  $position: $sheetPosition,
  userHidNotePreview,
  userMovedNotePreview,
  userMovedSheet,
  userRequestedANote,
  userStretchedNotePreview,
} = musicSheetViewport

const { $isLoaded, $isDirty } = serializer

const { $nodeCreationDialogShown, userCancelledNodeCreation, userSelectedNodePosition, userSelectedNodeType } =
  synthTreeViewport

const { userStoppedPlayback, userToggledPlayback } = noteScheduler

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
  userCancelledNodeCreation,
  userGrantedAudioPermission,
  userHidNotePreview,
  userMovedNotePreview,
  userMovedSheet,
  userRequestedANote,
  userSelectedNodePosition,
  userSelectedNodeType,
  userStoppedPlayback,
  userStretchedNotePreview,
  userToggledPlayback,
}
