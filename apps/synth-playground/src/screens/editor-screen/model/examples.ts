import BPM_RAMP_EXAMPLE from '#public/examples/bpm-ramp.txt'
import DEFAULT_EXAMPLE from '#public/examples/default.txt'
import STILL_ALIVE_EXAMPLE from '#public/examples/still-alive.txt'

export const EXAMPLES = {
  default: DEFAULT_EXAMPLE,
  'bpm-ramp': BPM_RAMP_EXAMPLE,
  'still-alive': STILL_ALIVE_EXAMPLE,
} as const

export type ExampleName = keyof typeof EXAMPLES

export const EXAMPLE_NAMES = Object.keys(EXAMPLES) as ExampleName[]
