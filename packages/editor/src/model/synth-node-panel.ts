import { CurveSynthParam, EnumSynthParam, NumberSynthParam, type SynthNode, type UnitName } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { combine, sample } from 'effector'
import { readonly } from 'patronum'
import { USER_UNIT_RANGES } from '#meta'
import type { ActionPayload } from './action'
import type { HistoryStore } from './history'
import type { SynthTreeStore } from './synth-tree'

type Params = {
  history: HistoryStore
  synthTree: SynthTreeStore
}

export type NodeParam = { name: string } & (
  | { type: 'number'; value: number; min: number; max: number }
  | { type: 'select'; value: string; variants: string[] }
)

export const createSynthNodePanel = createFactory((params: Params) => {
  const { history, synthTree } = params

  const $activeNodeId = combine(synthTree.$activeNode, node => node?.id ?? null)

  const $activeSynthNode = combine(synthTree.$activeNode, node => node?.synthNode ?? null)

  const $nodeParams = combine($activeSynthNode, synthNode => {
    if (!synthNode) {
      return null
    }

    return Object.keys(synthNode).flatMap<NodeParam>(key => {
      const param = synthNode[key as keyof SynthNode]

      if (param instanceof NumberSynthParam) {
        const { value, range: physicalRange, unit } = param
        const userRange = USER_UNIT_RANGES[unit as UnitName]
        const { min, max } = userRange ?? physicalRange
        return [{ type: 'number', name: key, value: value as number, min, max }]
      }

      if (param instanceof CurveSynthParam) {
        const { initialValue: value, range: physicalRange, unit } = param
        const userRange = USER_UNIT_RANGES[unit as UnitName]
        const { min, max } = userRange ?? physicalRange
        return [{ type: 'number', name: key, value: value as number, min, max }]
      }

      if (param instanceof EnumSynthParam) {
        const { value, variants } = param
        return [{ type: 'select', name: key, value: value as string, variants: variants as string[] } as const]
      }

      return []
    })
  })

  const setParamDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-node-param-set',
  })

  sample({
    clock: setParamDispatched,
    source: synthTree.$nodes,
    fn: (nodes, { id, param, value }) => {
      const node = nodes.get(id)
      if (!node) {
        return
      }

      const synthParam = node.synthNode[param as keyof SynthNode]

      if (typeof value === 'number' && synthParam instanceof NumberSynthParam) {
        synthParam.value = value
      }

      if (typeof value === 'number' && synthParam instanceof CurveSynthParam) {
        synthParam.initialValue = value
      }

      if (typeof value === 'string' && synthParam instanceof EnumSynthParam) {
        synthParam.value = value
      }
    },
  })

  return {
    $activeNodeId: readonly($activeNodeId),
    $nodeParams: readonly($nodeParams),
  }
})
