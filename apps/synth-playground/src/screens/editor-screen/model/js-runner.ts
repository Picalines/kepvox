import initSwc, { transform } from '@swc/wasm-web'
import { createFactory } from '@withease/factories'
import { attach, createEffect, createEvent, createStore, restore, sample } from 'effector'
import type { Gate } from 'effector-react'
import { equals, not, readonly, spread } from 'patronum'

export type JsRunnerStore = ReturnType<typeof createJsRunner>

type Params = {
  gate: Gate
}

export const createJsRunner = createFactory((params: Params) => {
  const { gate } = params

  const $state = createStore<'initializing' | 'ready' | 'running'>('initializing')
  const $error = createStore<null | Error>(null)

  const jsModulesChanged = createEvent<Record<string, object>>()
  const jsCodeSubmitted = createEvent<string>()
  const jsCodeRan = createEvent()

  const $jsCode = restore(jsCodeSubmitted, '')
  const $jsModules = restore(jsModulesChanged, {})

  const initFx = createEffect(async () => {
    await initSwc()
  })

  const runFx = attach({
    source: {
      jsCode: $jsCode,
      jsModules: $jsModules,
    },
    effect: async ({ jsCode, jsModules }) => {
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

        return jsModules[path]
      }

      const func = new Function('exports', 'require', transformedJs)
      const exports: Record<string, unknown> = {}
      func(exports, require)
    },
  })

  const logErrorFx = attach({
    source: $error,
    effect: error => {
      if (error) {
        console.error(`${error.name}:`, error.message)
      }
    },
  })

  sample({ clock: gate.open, target: initFx })
  sample({ clock: initFx.done, target: $state, fn: () => 'ready' as const })
  sample({ clock: initFx.failData, target: $error })

  sample({
    clock: jsCodeSubmitted,
    filter: not(equals($state, 'running')),
    fn: () => ({ status: 'running', error: null, run: undefined }) as const,
    target: spread({
      status: $state,
      error: $error,
      run: runFx,
    }),
  })

  sample({ clock: runFx.failData, target: $error })
  sample({ clock: runFx.finally, target: $state, fn: () => 'ready' as const })
  sample({ clock: runFx.finally, target: jsCodeRan })
  sample({ clock: $error, target: logErrorFx })

  return {
    $state: readonly($state),
    $error: readonly($error),
    jsModulesChanged,
    jsCodeSubmitted,
    jsCodeRan,
  }
})
