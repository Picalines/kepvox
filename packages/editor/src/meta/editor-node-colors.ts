import type { NODE_TYPES } from './editor-node-types'

export const NODE_COLORS = [
  'red',
  'rose',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'zinc',
] as const

type NodeColor = (typeof NODE_COLORS)[number]

export const DEFAULT_NODE_COLORS: Record<(typeof NODE_TYPES)[number], NodeColor> = {
  output: 'zinc',
  delay: 'teal',
  gain: 'amber',
  generator: 'emerald',
  oscillator: 'lime',
  reverb: 'orange',
}
