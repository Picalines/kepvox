import { ScClient, type ScClientConfig } from '@repo/sc-js'
import { createEffect, createEvent, createStore, sample } from 'effector'
import { readonly } from 'patronum/readonly'
import { spread } from 'patronum/spread'
import { createModelApi } from '~/shared/lib/model-api'

export enum ScClientStatus {
  Offline = 'OFFLINE',
  Connecting = 'CONNECTING',
  Connected = 'CONNECTED',
}

const { createModel, Provider, useModel } = createModelApi(() => {
  const $status = createStore(ScClientStatus.Offline)

  const $client = createStore<ScClient | null>(null)

  const connectFx = createEffect((config: ScClientConfig) =>
    ScClient.connect(config).then(client => (client ? Promise.resolve(client) : Promise.reject())),
  )

  const connectionAttempted = createEvent<ScClientConfig>()

  const freeAllSent = createEvent()

  sample({
    clock: connectionAttempted,
    source: $status,
    filter: status => status === ScClientStatus.Offline,
    target: spread({ status: $status, config: connectFx }),
    fn: (_, config) => ({ status: ScClientStatus.Connecting, config }),
  })

  sample({
    clock: connectFx.doneData,
    target: spread({ client: $client, status: $status }),
    fn: client => ({ client, status: ScClientStatus.Connected }),
  })

  sample({
    clock: [connectFx.fail],
    target: spread({ client: $client, status: $status }),
    fn: () => ({ client: null, status: ScClientStatus.Offline }),
  })

  sample({
    clock: freeAllSent,
    source: $client,
    fn: client => client?.freeAll(),
  })

  return {
    $status: readonly($status),
    connectionAttempted,
  }
})

export { createModel as createScClient, Provider as ScClientProvider, useModel as useScClient }
