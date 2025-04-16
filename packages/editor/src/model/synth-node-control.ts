import {
  CurveSynthParam,
  EnumSynthParam,
  NumberSynthParam,
  type SynthNode,
  SynthParam,
  type UnitName,
} from '@repo/synth'

export type NodeControl = { name: string } & (
  | { type: 'number'; value: number; unit: UnitName; step: number }
  | { type: 'slider'; value: number; step: number; min: number; max: number }
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

export const synthParamToControl = (name: string, param: SynthParam): NodeControl | null => {
  if (isNumberSynthParam(param)) {
    const { value, range, unit } = param
    const { min, max } = range
    const step = UNIT_STEP[unit]
    return SLIDER_UNITS.includes(unit)
      ? { type: 'slider', name, step, value, min, max }
      : { type: 'number', name, unit, step, value }
  }

  if (isCurveSynthParam(param)) {
    const { initialValue: value, range, unit } = param
    const { min, max } = range
    const step = UNIT_STEP[unit]
    return SLIDER_UNITS.includes(unit)
      ? { type: 'slider', name, step, value, min, max }
      : { type: 'number', name, unit, step, value }
  }

  if (isEnumSynthParam(param)) {
    const { value, variants } = param
    return { type: 'select', name, value, variants: [...variants] }
  }

  return null
}

const isNumberSynthParam = (param: SynthParam): param is NumberSynthParam<UnitName> => param instanceof NumberSynthParam

const isCurveSynthParam = (param: SynthParam): param is CurveSynthParam<UnitName> => param instanceof CurveSynthParam

const isEnumSynthParam = (param: SynthParam): param is EnumSynthParam<string> => param instanceof EnumSynthParam

const SLIDER_UNITS: UnitName[] = ['normal', 'audio']

const UNIT_STEP: Record<UnitName, number> = {
  seconds: 1 / 10,
  notes: 1 / 8,
  decibels: 1 / 5,
  hertz: 1,
  normal: 1 / 20,
  audio: 1 / 20,
  nonNegative: 1 / 10,
  factor: 1 / 10,
  ticks: 1,
}
