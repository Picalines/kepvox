import {
  CurveSynthParam,
  EnumSynthParam,
  NumberSynthParam,
  type SynthNode,
  SynthParam,
  type UnitName,
} from '@repo/synth'
import { USER_UNIT_RANGES } from '#meta'

export type NodeControl = { name: string } & (
  | { type: 'slider'; value: number; unit: UnitName; min: number; max: number }
  | { type: 'select'; value: string; variants: string[] }
)

export const synthParamByName = (synthNode: SynthNode, name: string) => {
  const synthParam = synthNode[name as keyof SynthNode]
  return synthParam instanceof SynthParam ? synthParam : null
}

export const synthNodeParams = (synthNode: SynthNode): [name: string, param: SynthParam][] => {
  return Object.keys(synthNode).flatMap(key => {
    const param = synthParamByName(synthNode, key)
    return param ? [[key, param]] : []
  })
}

export const synthParamToControl = (key: string, param: SynthParam): NodeControl | null => {
  if (isNumberSynthParam(param)) {
    const { value, range: physicalRange, unit } = param
    const userRange = USER_UNIT_RANGES[unit]
    const { min, max } = userRange ?? physicalRange
    return { type: 'slider', name: key, unit, value, min, max }
  }

  if (isCurveSynthParam(param)) {
    const { initialValue: value, range: physicalRange, unit } = param
    const userRange = USER_UNIT_RANGES[unit]
    const { min, max } = userRange ?? physicalRange
    return { type: 'slider', name: key, unit, value, min, max }
  }

  if (isEnumSynthParam(param)) {
    const { value, variants } = param
    return { type: 'select', name: key, value, variants: [...variants] }
  }

  return null
}

const isNumberSynthParam = (param: SynthParam): param is NumberSynthParam<UnitName> => param instanceof NumberSynthParam

const isCurveSynthParam = (param: SynthParam): param is CurveSynthParam<UnitName> => param instanceof CurveSynthParam

const isEnumSynthParam = (param: SynthParam): param is EnumSynthParam<string> => param instanceof EnumSynthParam
