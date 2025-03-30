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

const { $nodes: $synthNodes, $edges: $synthEdges } = synthTree

const { dispatched: actionDispatched } = history

const { $isDeserialized: $isLoaded, $serializedProject } = serializer

export { Gate, playback, $synthNodes, $synthEdges, actionDispatched, $isLoaded, $serializedProject }
