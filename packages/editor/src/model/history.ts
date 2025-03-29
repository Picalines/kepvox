import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { readonly, spread } from 'patronum'
import type { ConnectionPoint, EdgeId, NodeId, SynthTreeNodeType, SynthTreeStore } from './synth-tree'

export type EditorAction =
  | {
      type: 'synth-tree-node-created'
      id: NodeId
      nodeType: SynthTreeNodeType
      position: { x: number; y: number }
    }
  | {
      type: 'synth-tree-node-moved'
      id: NodeId
      to: { x: number; y: number }
    }
  | {
      type: 'synth-tree-node-deleted'
      id: NodeId
    }
  | {
      type: 'synth-tree-edge-created'
      id: EdgeId
      source: ConnectionPoint
      target: ConnectionPoint
    }
  | {
      type: 'synth-tree-edge-deleted'
      id: EdgeId
    }

const MAX_HISTORY_LENGTH = 1_000

type Params = {
  synthTree: SynthTreeStore
}

export const createHistory = createFactory((params: Params) => {
  const { synthTree } = params

  const $actions = createStore<EditorAction[]>([])

  const actionDispatched = createEvent<EditorAction>()
  const actionApplied = createEvent<EditorAction>()

  sample({
    clock: actionDispatched,
    source: $actions,
    target: spread({ actions: $actions, appliedAction: actionApplied }),
    fn: (actions, newAction) => {
      if (!actions.length) {
        return { actions: [newAction], appliedAction: newAction }
      }

      const newActions = [...actions]

      // TODO: remove duplicates of move actions.
      // Implement it when the undo/redo will be a thing

      newActions.push(newAction)

      while (newActions.length > MAX_HISTORY_LENGTH) {
        newActions.shift()
      }

      return { actions: newActions, appliedAction: newAction }
    },
  })

  sample({
    clock: actionApplied,
    filter: (action: EditorAction) => action.type === 'synth-tree-node-created',
    target: synthTree.nodeCreated,
    fn: ({ id, nodeType, position }) => ({ id, type: nodeType, position }),
  })

  sample({
    clock: actionApplied,
    filter: (action: EditorAction) => action.type === 'synth-tree-node-moved',
    target: synthTree.nodeMoved,
    fn: ({ id, to: position }) => ({ id, position }),
  })

  sample({
    clock: actionApplied,
    filter: (action: EditorAction) => action.type === 'synth-tree-node-deleted',
    target: synthTree.nodeDeleted,
  })

  sample({
    clock: actionApplied,
    filter: (action: EditorAction) => action.type === 'synth-tree-edge-created',
    target: synthTree.edgeCreated,
  })

  sample({
    clock: actionApplied,
    filter: (action: EditorAction) => action.type === 'synth-tree-edge-deleted',
    target: synthTree.edgeDeleted,
  })

  return {
    $actions: readonly($actions),
    actionDispatched,
    actionApplied,
  }
})
