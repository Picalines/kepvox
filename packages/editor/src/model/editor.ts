import { invoke } from '@withease/factories'
import { Gate } from './gate'
import { createHistory } from './history'
import { createPlayback } from './playback'
import { createSynthTree } from './synth-tree'

const history = invoke(createHistory)

const playback = invoke(createPlayback, { gate: Gate })

const synthTree = invoke(createSynthTree, { history, playback })

const { $nodes: $synthNodes, $edges: $synthEdges } = synthTree

const { dispatched: actionDispatched } = history

export { Gate, playback, $synthNodes, $synthEdges, actionDispatched }
