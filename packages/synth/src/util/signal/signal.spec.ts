import { expect, it, vi } from 'vitest'
import { Signal } from './signal'

it('should call a callback', () => {
  const { signal, emit } = Signal.controlled<number>()
  const callback = vi.fn((x: number) => x)

  signal.watch(callback)
  emit(123)

  expect(callback).toHaveBeenCalledOnce()
  expect(callback).toHaveBeenCalledWith(123)
})

it('should call repeated callback the same number of times', () => {
  const { signal, emit } = Signal.controlled<number>()
  const callback = vi.fn((x: number) => x)

  signal.watch(callback)
  signal.watch(callback)
  signal.watch(callback)
  emit(123)

  expect(callback).toHaveBeenCalledTimes(3)
  expect(callback).toHaveBeenCalledWith(123)
})

it('should not call an unsubscribed callback', () => {
  const { signal, emit } = Signal.controlled<null>()
  const callback = vi.fn()

  signal.watch(callback)
  signal.cancel(callback)
  emit(null)

  expect(callback).not.toHaveBeenCalled()
})

it('should not throw on unknown callback in off', () => {
  const { signal } = Signal.controlled<null>()

  expect(() => {
    signal.cancel(() => {})
  }).not.toThrow()
})

it('should call callback once if the flag is passed', () => {
  const { signal, emit } = Signal.controlled<null>({ once: true })
  const callback = vi.fn()

  signal.watch(callback)
  emit(null)
  emit(null)

  expect(callback).toHaveBeenCalledOnce()
})

it('should ignore the cancelled callback', () => {
  const { signal: signal1, emit: emit1 } = Signal.controlled<null>()
  const { signal: signal2, emit: emit2 } = Signal.controlled<null>()
  const callback = vi.fn()

  signal1.watchUntil(signal2, callback)
  emit2(null)
  emit1(null)

  expect(callback).not.toHaveBeenCalled()
})

it('should not watch if the once cancel was already emitted', () => {
  const { signal: signal1, emit: emit1 } = Signal.controlled<null>()
  const { signal: signal2, emit: emit2 } = Signal.controlled<null>({ once: true })
  const callback = vi.fn()

  emit2(null)
  signal1.watchUntil(signal2, callback)
  emit1(null)

  expect(callback).not.toHaveBeenCalled()
})
