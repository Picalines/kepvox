import { createEvent, createStore, sample } from 'effector'

export const $isConnecting = createStore(false)

export const connectionStarted = createEvent()

sample({
  clock: connectionStarted,
  target: $isConnecting,
  fn: () => true,
})
