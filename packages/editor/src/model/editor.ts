import { invoke } from '@withease/factories'
import { sample } from 'effector'
import { Gate } from './gate'
import { createHistory } from './history'
import { createPlayback } from './playback'
import { createSynthTree } from './synth-tree'

const playback = invoke(createPlayback)

const synthTree = invoke(createSynthTree, { playback })

const history = invoke(createHistory, { synthTree })

sample({
  clock: Gate.open,
  target: playback.initialized,
})

sample({
  clock: Gate.close,
  target: playback.disposed,
})

const { $nodes: $synthNodes, $edges: $synthEdges } = synthTree

const { actionDispatched } = history

export { Gate, playback, $synthNodes, $synthEdges, actionDispatched }
