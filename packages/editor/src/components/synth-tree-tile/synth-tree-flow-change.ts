import type { EdgeChange as FlowEdgeChange, NodeChange as FlowNodeChange } from '@xyflow/react'
import type { ActionPayload } from '#model'

export const synthTreeNodeChangeToAction = (change: FlowNodeChange): ActionPayload | null => {
  // NOTE: 'add' is called by <Controls/>
  switch (change.type) {
    case 'position': {
      const { id, position } = change

      if (position) {
        return { action: 'synth-node-move', id, to: position }
      }

      break
    }

    case 'remove': {
      const { id } = change
      return { action: 'synth-node-delete', id }
    }

    case 'select': {
      const { id, selected } = change
      return { action: 'synth-node-select', id, selected }
    }
  }

  return null
}

export const synthTreeEdgeChangeToAction = (change: FlowEdgeChange): ActionPayload | null => {
  switch (change.type) {
    case 'add': {
      const { id, source, sourceHandle, target, targetHandle } = change.item
      return {
        action: 'synth-edge-create',
        id,
        source: { node: source, socket: Number.parseInt(sourceHandle ?? '0') },
        target: { node: target, socket: Number.parseInt(targetHandle ?? '0') },
      }
    }

    case 'remove': {
      const { id } = change
      return { action: 'synth-edge-delete', id }
    }

    case 'select': {
      const { id, selected } = change
      return { action: 'synth-edge-select', id, selected }
    }
  }

  return null
}
