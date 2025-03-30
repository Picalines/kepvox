import type { EdgeChange as FlowEdgeChange, NodeChange as FlowNodeChange } from '@xyflow/react'
import type { EditorAction } from '#model'

export const flowNodeChangeToEditorAction = (change: FlowNodeChange): EditorAction | null => {
  // NOTE: 'add' is called by <Controls/>
  switch (change.type) {
    case 'position': {
      const { id, position } = change

      if (position) {
        return { type: 'synth-tree-node-moved', id, to: position }
      }

      break
    }

    case 'remove': {
      const { id } = change
      return { type: 'synth-tree-node-deleted', id }
    }

    case 'select': {
      const { id, selected } = change
      return { type: 'synth-tree-node-selected', id, selected }
    }
  }

  return null
}

export const flowEdgeChangeToEditorAction = (change: FlowEdgeChange): EditorAction | null => {
  switch (change.type) {
    case 'add': {
      const { id, source, sourceHandle, target, targetHandle } = change.item
      return {
        type: 'synth-tree-edge-created',
        id,
        source: { node: source, socket: Number.parseInt(sourceHandle ?? '0') },
        target: { node: target, socket: Number.parseInt(targetHandle ?? '0') },
      }
    }

    case 'remove': {
      const { id } = change
      return { type: 'synth-tree-edge-deleted', id }
    }

    case 'select': {
      const { id, selected } = change
      return { type: 'synth-tree-edge-selected', id, selected }
    }
  }

  return null
}
