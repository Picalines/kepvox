import initSwc, { transform } from '@swc/wasm-web'
import { createFactory } from '@withease/factories'
import { createEffect, createEvent, createStore, sample } from 'effector'
import { equals, not, readonly, spread } from 'patronum'

type Params = {
  modules: Readonly<Record<string, () => object>>
}

export const createJsRunner = createFactory((params: Params) => {
  const { modules } = params

  const $state = createStore<null | 'initialized' | 'running' | 'success' | 'error'>(null)
  const $error = createStore<null | Error>(null)

  const initialized = createEvent()
  const codeSubmitted = createEvent<string>()

  const initFx = createEffect(async () => {
    await initSwc()
  })

  const runFx = createEffect(async (jsCode: string) => {
    let transformedJs: string

    try {
      const output = await transform(jsCode, {
        module: { type: 'commonjs' },
        jsc: {
          parser: { syntax: 'typescript' },
        },
      })

      transformedJs = output.code
    } catch (error) {
      throw error instanceof Error ? error : new SyntaxError(String(error))
    }

    const require = (path: unknown) => {
      if (typeof path !== 'string') {
        throw new TypeError()
      }

      const moduleFactory = modules[path]

      if (!moduleFactory) {
        throw new Error(`module not found: ${path}`)
      }

      return moduleFactory()
    }

    const func = new Function('exports', 'require', transformedJs)
    const exports: Record<string, unknown> = {}
    func(exports, require)
  })

  sample({
    clock: initialized,
    target: initFx,
  })

  sample({
    clock: initFx.done,
    target: $state,
    fn: () => 'initialized' as const,
  })

  sample({
    clock: initFx.failData,
    target: $error,
  })

  sample({
    clock: codeSubmitted,
    filter: not(equals($state, 'running')),
    fn: code => ({ code, status: 'running', error: null }) as const,
    target: spread({
      code: runFx,
      status: $state,
      error: $error,
    }),
  })

  sample({
    clock: runFx.done,
    target: $state,
    fn: () => 'success' as const,
  })

  sample({
    clock: runFx.failData,
    fn: error => ({ status: 'error', error }) as const,
    target: spread({
      status: $state,
      error: $error,
    }),
  })

  $error.watch(error => {
    if (error) {
      console.error(`${error.name}:`, error.message)
    }
  })

  return { initialized, $state: readonly($state), $error: readonly($error), codeSubmitted, modules }
})
