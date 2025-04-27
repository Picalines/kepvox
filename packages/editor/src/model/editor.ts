import { invoke } from '@withease/factories'
import { enableMapSet as immerEnableMapSet } from 'immer'
import { createEditorGate } from './gate'
import { createHistory } from './history'
import { createMusicSheet } from './music-sheet'
import { createMusicSheetViewport } from './music-sheet-viewport'
import { createNoteScheduler } from './note-scheduler'
import { createPlayback } from './playback'
import { createSerializer } from './serializer'
import { createSynthNodePanel } from './synth-node-panel'
import { createSynthTree } from './synth-tree'
import { createSynthTreeViewport } from './synth-tree-viewport'

immerEnableMapSet()

const gate = invoke(createEditorGate)

const history = invoke(createHistory, { gate })

const playback = invoke(createPlayback, { gate })

const synthTree = invoke(createSynthTree, { history, playback })

const synthNodePanel = invoke(createSynthNodePanel, { history, synthTree })

const musicSheet = invoke(createMusicSheet, { history, synthTree, playback })

const musicSheetViewport = invoke(createMusicSheetViewport, { gate, history, synthTree })

const serializer = invoke(createSerializer, { gate, history, synthTree, musicSheet })

const synthTreeViewport = invoke(createSynthTreeViewport, { history, synthTree, serializer })

const noteScheduler = invoke(createNoteScheduler, { musicSheet, synthTree, playback })

const { $isExternalLoading, $isReadonly, Gate } = gate

const { userRequestedActions } = history

const { $hasAudioPermission, $isPlaying, $playhead, userGrantedAudioPermission, userSetPlayhead } = playback

const { $edges: $synthEdges, $nodes: $synthNodes, $activeNode: $activeSynthNode } = synthTree

const { $activeNodeControls, userSelectedNodeColor } = synthNodePanel

const { $notes: $sheetNotes, $timeSignature, $beatsPerMinute, $endTime } = musicSheet

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
  $activeNodeControls,
  $activeSynthNode,
  $beatsPerMinute,
  $endTime,
  $hasAudioPermission,
  $isDirty,
  $isExternalLoading,
  $isLoaded,
  $isPlaying,
  $isReadonly,
  $nodeCreationDialogShown,
  $notePreview,
  $playhead,
  $sheetNotes,
  $sheetPosition,
  $synthEdges,
  $synthNodes,
  $timeSignature,
  Gate,
  userCancelledNodeCreation,
  userGrantedAudioPermission,
  userHidNotePreview,
  userMovedNotePreview,
  userMovedSheet,
  userRequestedANote,
  userRequestedActions,
  userSelectedNodeColor,
  userSelectedNodePosition,
  userSelectedNodeType,
  userSetPlayhead,
  userStoppedPlayback,
  userStretchedNotePreview,
  userToggledPlayback,
}
