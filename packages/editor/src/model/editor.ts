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

const { $hasAudioPermission, $state: $playbackState, audioPermissionGranted } = playback

const { $nodes: $synthNodes, $edges: $synthEdges } = synthTree

const { $isDeserialized: $isLoaded, $serializedProject } = serializer

export {
  Gate,
  actionDispatched,
  $hasAudioPermission,
  $playbackState,
  audioPermissionGranted,
  $synthNodes,
  $synthEdges,
  $isLoaded,
  $serializedProject,
}
