import { CurveSynthParam, EnumSynthParam, NumberSynthParam } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { combine, createStore, sample } from 'effector'
import { produce } from 'immer'
import { readonly } from 'patronum'
import type { ActionPayload } from './action'
import type { HistoryStore } from './history'
import { type NodeControl, synthNodeParams, synthParamByName, synthParamToControl } from './synth-node-control'
import type { SynthTreeStore } from './synth-tree'

type Params = {
  history: HistoryStore
  synthTree: SynthTreeStore
}

export const createSynthNodePanel = createFactory((params: Params) => {
  const { history, synthTree } = params

  const $nodeControls = createStore<NodeControl[]>([])

  const $activeNodeId = combine(synthTree.$activeNode, node => node?.id ?? null)

  const $activeSynthNode = combine(synthTree.$activeNode, node => node?.synthNode ?? null)

  sample({
    clock: $activeSynthNode,
    target: $nodeControls,
    fn: synthNode => {
      if (!synthNode) return []
      return synthNodeParams(synthNode).flatMap(([key, param]) => {
        const control = synthParamToControl(key, param)
        return control ? [control] : []
      })
    },
  })

  const setParamDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-node-param-set',
  })

  const nodeParamChanged = sample({
    clock: setParamDispatched,
    source: synthTree.$nodes,
    fn: (nodes, { id, param, value }) => {
      const node = nodes.get(id)
      const synthParam = node && synthParamByName(node.synthNode, param)
      if (!synthParam) {
        return null
      }

      if (typeof value === 'number' && synthParam instanceof NumberSynthParam) {
        synthParam.value = value
        return { nodeId: id, param, value: synthParam.value }
      }

      if (typeof value === 'number' && synthParam instanceof CurveSynthParam) {
        synthParam.initialValue = value
        return { nodeId: id, param, value: synthParam.initialValue }
      }

      if (typeof value === 'string' && synthParam instanceof EnumSynthParam) {
        synthParam.value = value
        return { nodeId: id, param, value: synthParam.value }
      }

      return null
    },
  })

  sample({
    clock: sample({ clock: nodeParamChanged, filter: Boolean }),
    source: { nodeControls: $nodeControls, synthNode: $activeSynthNode },
    target: $nodeControls,
    fn: ({ nodeControls, synthNode }, change) =>
      produce(nodeControls, draft => {
        const synthParam = synthNode && synthParamByName(synthNode, change.param)
        const control = synthParam && synthParamToControl(change.param, synthParam)
        const controlIndex = nodeControls.findIndex(control => control.name === change.param)

        if (control && controlIndex >= 0) {
          draft[controlIndex] = control
        }
      }),
  })

  return {
    $activeNodeId: readonly($activeNodeId),
    $nodeControls: readonly($nodeControls),
  }
})
