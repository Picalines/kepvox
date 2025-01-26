import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { readonly } from 'patronum'

export const createCodeEditor = createFactory(() => {
  const userCode = createStore('')

  const userCodeChanged = createEvent<string>()

  sample({
    clock: userCodeChanged,
    target: userCode,
  })

  return {
    userCode: readonly(userCode),
    userCodeChanged,
  }
})
