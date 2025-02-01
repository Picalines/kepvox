import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { not, readonly } from 'patronum'

type Params = {
  defaultCode?: string
}

export const createCodeEditor = createFactory((params: Params) => {
  const { defaultCode = '' } = params

  const $code = createStore(defaultCode)

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
