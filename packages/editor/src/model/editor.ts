import { invoke } from '@withease/factories'
import { Gate } from './gate'
import { createHistory } from './history'
import { createPlayback } from './playback'
import { createSerializer } from './serializer'
import { createSynthTree } from './synth-tree'

const history = invoke(createHistory)

const playback = invoke(createPlayback, { gate: Gate })

const synthTree = invoke(createSynthTree, { history, playback })

const serializer = invoke(createSerializer, { gate: Gate, history, synthTree })

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

const { $haveChanged, $isDeserialized: $isLoaded, $serializedProject } = serializer

export {
  $hasAudioPermission,
  $haveChanged,
  $isLoaded,
  $isPlaying,
  $playbackProgress,
  $serializedProject,
  $synthEdges,
  $synthNodes,
  Gate,
  actionDispatched,
  audioPermissionGranted,
  playbackStarted,
  playbackStopped,
  playheadSet,
}
