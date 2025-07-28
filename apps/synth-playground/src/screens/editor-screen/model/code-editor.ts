import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import type { Gate } from 'effector-react'
import { persist as persistInQuery } from 'effector-storage/query'
import { not, readonly } from 'patronum'
import INITIAL_CODE from '#public/initial-code.txt'
import { base64Url } from '#shared/base64-url'

export type CodeEditorStore = ReturnType<typeof createCodeEditor>

type Params = {
  gate: Gate
}

export const createCodeEditor = createFactory((params: Params) => {
  const { gate } = params

  const $code = createStore(INITIAL_CODE)

  const $isReadonly = createStore(false)

  const userChangedCode = createEvent<string>()

  sample({
    clock: userChangedCode,
    filter: not($isReadonly),
    target: $code,
  })

  // TODO: maybe find another way to fix this
  if (!process.env.STORYBOOK) {
    persistInQuery({
      key: 'code',
      source: $code,
      pickup: gate.open,
      target: userChangedCode,
      serialize: base64Url.encode,
      deserialize: base64Url.decode,
      timeout: 10,
    })
  }

  return {
    $code: readonly($code),
    $isReadonly,
    userChangedCode,
  }
})
