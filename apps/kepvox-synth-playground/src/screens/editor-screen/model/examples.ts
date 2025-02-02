import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { readonly } from 'patronum'
import bpmRampExample from '#public/examples/bpm-ramp.txt'
import defaultExample from '#public/examples/default.txt'

export const EXAMPLES = { default: defaultExample, 'bpm-ramp': bpmRampExample } as const

type ExampleName = keyof typeof EXAMPLES

export const createExampleSelector = createFactory(() => {
  const $exampleName = createStore<ExampleName>('default')
  const $exampleCode = createStore(EXAMPLES[$exampleName.getState()])

  const exampleSelected = createEvent<ExampleName>()

  sample({
    clock: exampleSelected,
    filter: example => example in EXAMPLES,
    target: $exampleName,
  })

  sample({
    clock: $exampleName,
    target: $exampleCode,
    fn: example => EXAMPLES[example],
  })

  return {
    $exampleName: readonly($exampleName),
    $exampleCode: readonly($exampleCode),
    exampleSelected,
  }
})
