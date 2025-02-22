import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { readonly } from 'patronum'
import bpmRampExample from '#public/examples/bpm-ramp.txt'
import defaultExample from '#public/examples/default.txt'
import stilAliveExample from '#public/examples/still-alive.txt'

export const EXAMPLES = {
  default: defaultExample,
  'bpm-ramp': bpmRampExample,
  'still-alive': stilAliveExample,
} as const

type ExampleName = keyof typeof EXAMPLES

type Example = {
  name: ExampleName
  code: string
}

export const createExampleSelector = createFactory(() => {
  const $example = createStore<Example>({ name: 'default', code: EXAMPLES.default })

  const exampleSelected = createEvent<ExampleName>()

  sample({
    clock: exampleSelected,
    filter: exampleName => exampleName in EXAMPLES,
    fn: exampleName => ({ name: exampleName, code: EXAMPLES[exampleName] }),
    target: $example,
  })

  return {
    $example: readonly($example),
    exampleSelected,
  }
})
