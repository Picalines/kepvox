import { describe, expect, it, vi } from 'vitest'
import { Signal } from './signal'

describe('watch', () => {
  it('should call a callback', () => {
    const { signal, emit } = Signal.controlled<number>()
    const callback = vi.fn()

    signal.watch(callback)
    emit(123)

    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith(123)
  })

  it('should call repeated callback the same number of times', () => {
    const { signal, emit } = Signal.controlled<number>()
    const callback = vi.fn()

    signal.watch(callback)
    signal.watch(callback)
    signal.watch(callback)

    emit(123)

    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(123)
  })
})

describe('cancel', () => {
  it('should not call an unsubscribed callback', () => {
    const { signal, emit } = Signal.controlled<null>()
    const callback = vi.fn()

    signal.watch(callback)
    signal.cancel(callback)
    emit(null)

    expect(callback).not.toHaveBeenCalled()
  })

  it('should not throw when cancelling an unknown callback', () => {
    const { signal } = Signal.controlled<null>()

    expect(() => {
      signal.cancel(() => {})
    }).not.toThrow()
  })

  it('should remove one callback repeat at a time', () => {
    const { signal, emit } = Signal.controlled<null>()
    const callback = vi.fn()

    signal.watch(callback)
    signal.watch(callback)
    signal.watch(callback)
    signal.cancel(callback)

    emit(null)

    expect(callback).toHaveBeenCalledTimes(2)
  })
})

describe('Signal.controlled', () => {
  it('should call callback once if the flag is passed', () => {
    const { signal, emit } = Signal.controlled<null>({ once: true })
    const callback = vi.fn()

    signal.watch(callback)
    emit(null)
    emit(null)

    expect(callback).toHaveBeenCalledOnce()
  })
})

describe('watchUntil', () => {
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

  it('should call a callback once when a cancel signal is the watched signal', () => {
    const { signal, emit } = Signal.controlled<null>()
    const callback = vi.fn()

    signal.watchUntil(signal, callback)
    emit(null)
    emit(null)

    expect(callback).toHaveBeenCalledOnce()
  })

  it('should clear all listeners when the cancel signal is the watched signal', () => {
    const { signal, emit } = Signal.controlled<null>()

    signal.watchUntil(signal, () => {})
    emit(null)

    expect(signal.watched).toBe(false)
  })
})

describe('toggle', () => {
  it('should call apply and undo callbacks once', () => {
    const { signal, emit } = Signal.controlled<null>()
    const { signal: until, emit: emitUntil } = Signal.controlled<null>()
    const applyCallback = vi.fn()
    const undoCallback = vi.fn()

    signal.toggle(until, applyCallback, undoCallback)
    emit(null)
    emit(null)
    emitUntil(null)
    emitUntil(null)

    expect(applyCallback).toHaveBeenCalledOnce()
    expect(undoCallback).toHaveBeenCalledOnce()
    expect(signal.watched).toBe(true)
    expect(until.watched).toBe(false)
  })

  it("should not call undo callback if the apply signal haven't been called yet", () => {
    const { signal } = Signal.controlled<null>()
    const { signal: until, emit: emitUndo } = Signal.controlled<null>()
    const undoCallback = vi.fn()

    signal.toggle(until, () => {}, undoCallback)
    emitUndo(null)

    expect(undoCallback).not.toHaveBeenCalled()
  })
})
