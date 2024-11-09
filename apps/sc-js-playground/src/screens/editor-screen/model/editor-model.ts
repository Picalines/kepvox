import type { ScClientConfig } from '@repo/sc-js'
import type { ScServerConfig } from '@repo/sc-synth'
import { combine, createEvent, sample } from 'effector'
import { not } from 'patronum/not'
import { ScClientStatus, createScClient } from '~/entities/sc-client'
import { ScServerStatus, createScServer } from '~/entities/sc-server'

const SC_SERVER_CONFIG: ScServerConfig = {
  port: 57110,
  numberOfInputs: 0,
  numberOfOutputs: 2,
}

const SC_CLIENT_CONFIG: ScClientConfig = {
  port: SC_SERVER_CONFIG.port,
  timeout: 10_000,
}

export const scServer = createScServer()

export const scClient = createScClient()

export const onPlaybackRequested = createEvent()

export const isScInitializing = combine(
  scServer.$status,
  scClient.$status,
  (serverStatus, clientStatus) => serverStatus === ScServerStatus.Booting || clientStatus === ScClientStatus.Connecting,
)

export const isScRunning = combine(
  scServer.$status,
  scClient.$status,
  (serverStatus, clientStatus) => serverStatus === ScServerStatus.Running && clientStatus === ScClientStatus.Connected,
)

sample({
  clock: onPlaybackRequested,
  filter: not(isScRunning),
  target: scServer.bootInitiated,
  fn: () => SC_SERVER_CONFIG,
})

sample({
  clock: [scServer.$status, onPlaybackRequested],
  source: scServer.$status,
  filter: status => status === ScServerStatus.Running,
  target: scClient.connectionAttempted,
  fn: () => SC_CLIENT_CONFIG,
})
