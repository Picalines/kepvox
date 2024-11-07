import { bootSuperCollider } from '@repo/sc-synth'
import { createEffect, createEvent, createStore, sample } from 'effector'
import { readonly, spread } from 'patronum'
import { createModelApi } from '~/shared/lib/model-api'

type BootConfig = Parameters<typeof bootSuperCollider>[0]

export enum SCServerStatus {
  None = 'NONE',
  Booting = 'BOOTING',
  Running = 'RUNNING',
}

const { createModel, Provider, useModel } = createModelApi(() => {
  const bootFx = createEffect(bootSuperCollider)

  const $status = createStore(SCServerStatus.None)

  const $bootConfig = createStore<BootConfig | null>(null)

  const bootInitiated = createEvent<BootConfig>()

  sample({
    clock: bootInitiated,
    source: $status,
    filter: status => status === SCServerStatus.None,
    fn: (_, config) => ({ config, status: SCServerStatus.Booting }),
    target: spread({
      config: [$bootConfig, bootFx],
      status: $status,
    }),
  })

  sample({
    clock: bootFx.finally,
    target: $status,
    fn: ({ status: fxStatus }) => (fxStatus === 'done' ? SCServerStatus.Running : SCServerStatus.None),
  })

  return {
    $status: readonly($status),
    $bootConfig: readonly($bootConfig),
    bootInitiated,
  }
})

export { createModel as createSCServer, Provider as SCServerProvider, useModel as useSCServer }
