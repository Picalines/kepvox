import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { readonly } from 'patronum'

export const createCodeEditor = createFactory(() => {
  const $code = createStore('')

  const codeChanged = createEvent<string>()

  sample({
    clock: codeChanged,
    target: $code,
  })

  return {
    $code: readonly($code),
    codeChanged,
  }
})
