import { type ScServerConfig, bootSuperCollider } from '@repo/sc-synth'
import { createEffect, createEvent, createStore, sample } from 'effector'
import { readonly } from 'patronum/readonly'
import { spread } from 'patronum/spread'
import { createModelApi } from '~/shared/lib/model-api'

export enum ScServerStatus {
  Offline = 'OFFLINE',
  Booting = 'BOOTING',
  Running = 'RUNNING',
}

const { createModel, Provider, useModel } = createModelApi(() => {
  const bootFx = createEffect(bootSuperCollider)

  const $status = createStore(ScServerStatus.Offline)

  const bootAttempted = createEvent<ScServerConfig>()

  sample({
    clock: bootAttempted,
    source: $status,
    filter: status => status === ScServerStatus.Offline,
    fn: (_, config) => ({ status: ScServerStatus.Booting, config }),
    target: spread({
      status: $status,
      config: bootFx,
    }),
  })

  sample({
    clock: bootFx.finally,
    target: $status,
    fn: ({ status: fxStatus }) => (fxStatus === 'done' ? ScServerStatus.Running : ScServerStatus.Offline),
  })

  return {
    $status: readonly($status),
    bootInitiated: bootAttempted,
  }
})

export { createModel as createScServer, Provider as ScServerProvider, useModel as useScServer }
