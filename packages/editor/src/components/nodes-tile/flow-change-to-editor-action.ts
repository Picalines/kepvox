import type { EdgeChange as FlowEdgeChange, NodeChange as FlowNodeChange } from '@xyflow/react'
import type { ActionPayload } from '#model'

export const flowNodeChangeToEditorAction = (change: FlowNodeChange): ActionPayload | null => {
  // NOTE: 'add' is called by <Controls/>
  switch (change.type) {
    case 'position': {
      const { id, position } = change

      if (position) {
        return { action: 'synth-node-moved', id, to: position }
      }

      break
    }

    case 'remove': {
      const { id } = change
      return { action: 'synth-node-deleted', id }
    }

    case 'select': {
      const { id, selected } = change
      return { action: 'synth-node-selected', id, selected }
    }
  }

  return null
}

export const flowEdgeChangeToEditorAction = (change: FlowEdgeChange): ActionPayload | null => {
  switch (change.type) {
    case 'add': {
      const { id, source, sourceHandle, target, targetHandle } = change.item
      return {
        action: 'synth-edge-created',
        id,
        source: { node: source, socket: Number.parseInt(sourceHandle ?? '0') },
        target: { node: target, socket: Number.parseInt(targetHandle ?? '0') },
      }
    }

    case 'remove': {
      const { id } = change
      return { action: 'synth-edge-deleted', id }
    }

    case 'select': {
      const { id, selected } = change
      return { action: 'synth-edge-selected', id, selected }
    }
  }

  return null
}
