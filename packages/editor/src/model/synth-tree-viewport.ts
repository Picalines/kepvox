import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { nanoid } from 'nanoid'
import { spread } from 'patronum'
import type { ActionPayload } from './action'
import type { HistoryStore } from './history'
import type { NodePosition, NodeType } from './project'
import type { SerializerStore } from './serializer'
import { DEFAULT_NODE_COLORS } from './synth-node-meta'
import type { SynthTreeStore } from './synth-tree'

export type SynthTreeViewportStore = ReturnType<typeof createSynthTreeViewport>

type Params = {
  history: HistoryStore
  synthTree: SynthTreeStore
  serializer: SerializerStore
}

export const createSynthTreeViewport = createFactory((params: Params) => {
  const { history, synthTree, serializer } = params

  const $nextNodeNumber = createStore(0)

  const nodeRequested = createEvent<{ type: NodeType; position: NodePosition }>()

  sample({
    clock: serializer.$isLoaded,
    filter: serializer.$isLoaded,
    source: synthTree.$nodes,
    target: $nextNodeNumber,
    fn: nodes => nodes.size,
  })

  sample({
    clock: nodeRequested,
    source: $nextNodeNumber,
    target: spread({ action: history.dispatched, nextNumber: $nextNodeNumber }),
    fn: (number, { type, position }) => ({
      action: {
        action: 'synth-node-created',
        id: nanoid(),
        type,
        position,
        number,
        color: DEFAULT_NODE_COLORS[type],
      } as ActionPayload,
      nextNumber: number + 1,
    }),
  })

  return {
    nodeRequested,
  }
})
