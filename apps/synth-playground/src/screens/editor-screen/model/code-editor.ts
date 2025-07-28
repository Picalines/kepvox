import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { not, readonly } from 'patronum'
import INITIAL_CODE from '#public/initial-code.txt'

export const createCodeEditor = createFactory(() => {
  const $code = createStore(INITIAL_CODE)

  const $isReadonly = createStore(false)

  const codeChanged = createEvent<string>()

  sample({
    clock: codeChanged,
    filter: not($isReadonly),
    target: $code,
  })

  return {
    $code: readonly($code),
    $isReadonly,
    codeChanged,
  }
})
