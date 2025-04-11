import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { nanoid } from 'nanoid'
import { readonly, spread } from 'patronum'
import { DEFAULT_NODE_COLORS } from '#meta'
import type { ActionPayload } from './action'
import type { HistoryStore } from './history'
import type { NodePosition, NodeType } from './project'
import type { SerializerStore } from './serializer'
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
  const $newNodePosition = createStore<NodePosition>({ x: 0, y: 0 })
  const $nodeCreationDialogShown = createStore(false)

  const nodePositionSelected = createEvent<{ position: NodePosition }>()
  const nodeTypeSelected = createEvent<{ type: NodeType }>()
  const nodeCreationCancelled = createEvent()

  sample({
    clock: serializer.$isLoaded,
    filter: serializer.$isLoaded,
    source: synthTree.$nodes,
    target: $nextNodeNumber,
    fn: nodes => nodes.size,
  })

  sample({
    clock: nodePositionSelected,
    target: spread({ position: $newNodePosition, dialogShown: $nodeCreationDialogShown }),
    fn: ({ position }) => ({ position, dialogShown: true }),
  })

  sample({
    clock: nodeTypeSelected,
    filter: $nodeCreationDialogShown,
    source: { position: $newNodePosition, number: $nextNodeNumber },
    target: spread({
      action: history.dispatched,
      dialogShown: $nodeCreationDialogShown,
      nextNumber: $nextNodeNumber,
    }),
    fn: ({ position, number }, { type }) => ({
      nextNumber: number + 1,
      dialogShown: false,
      action: {
        action: 'synth-node-created',
        id: nanoid(),
        type,
        position,
        number,
        color: DEFAULT_NODE_COLORS[type],
      } as ActionPayload,
    }),
  })

  sample({
    clock: nodeCreationCancelled,
    target: $nodeCreationDialogShown,
    fn: () => false,
  })

  return {
    $nodeCreationDialogShown: readonly($nodeCreationDialogShown),
    nodePositionSelected,
    nodeTypeSelected,
    nodeCreationCancelled,
  }
})
