import { Emitter } from '.'

it('should call a callback', () => {
  const emitter = new Emitter<{ event: [number] }>()
  const callback = vi.fn((x: number) => x)

  emitter.on('event', callback)
  emitter.emit('event', 123)

  expect(callback).toHaveBeenCalledOnce()
  expect(callback).toHaveBeenCalledWith(123)
})

it('should call repeated callback the same number of times', () => {
  const emitter = new Emitter<{ event: [number] }>()
  const callback = vi.fn((x: number) => x)

  emitter.on('event', callback)
  emitter.on('event', callback)
  emitter.on('event', callback)
  emitter.emit('event', 123)

  expect(callback).toHaveBeenCalledTimes(3)
  expect(callback).toHaveBeenCalledWith(123)
})

it('should not call a callback on different event', () => {
  const emitter = new Emitter<{ event1: []; event2: [] }>()
  const callback = vi.fn()

  emitter.on('event1', callback)
  emitter.on('event2', () => {})
  emitter.emit('event2')

  expect(callback).not.toHaveBeenCalled()
})

it('should not call an unsubscribed callback', () => {
  const emitter = new Emitter<{ event: [] }>()
  const callback = vi.fn()

  emitter.on('event', callback)
  emitter.off('event', callback)
  emitter.emit('event')

  expect(callback).not.toHaveBeenCalled()
})

it('should not throw on unknown callback in off', () => {
  const emitter = new Emitter<{ event: [] }>()

  expect(() => {
    emitter.off('event', () => {})
  }).not.toThrow()
})

it('should ignore an event without listeners', () => {
  const emitter = new Emitter<{ event: [] }>()

  expect(() => {
    emitter.emit('event')
  }).not.toThrow()
})

it('should call a once callback only once', () => {
  const emitter = new Emitter<{ event: [] }>()
  const callback = vi.fn()

  emitter.once('event', callback)
  emitter.emit('event')
  emitter.emit('event')

  expect(callback).toHaveBeenCalledOnce()
})

it('should call a once callback the number of times it was added', () => {
  const emitter = new Emitter<{ event: [] }>()
  const callback = vi.fn()

  emitter.once('event', callback)
  emitter.once('event', callback)
  emitter.emit('event')
  emitter.emit('event')
  emitter.emit('event')

  expect(callback).toHaveBeenCalledTimes(2)
})

it('should ignore the cancelled once callback', () => {
  const emitter = new Emitter<{ event: [] }>()
  const callback = vi.fn()

  const cancel = emitter.once('event', callback)
  cancel()
  emitter.emit('event')

  expect(callback).not.toHaveBeenCalled()
})

it('should ignore repeated cancel of a once callback', () => {
  const emitter = new Emitter<{ event: [] }>()
  const callback = vi.fn()

  const cancel = emitter.once('event', callback)

  expect(() => {
    cancel()
    cancel()
  }).not.toThrow()

  expect(callback).not.toHaveBeenCalled()
})

it('should ignore the cancel call after a once callback was emitted', () => {
  const emitter = new Emitter<{ event: [] }>()
  const callback = vi.fn()

  const cancel = emitter.once('event', callback)
  emitter.emit('event')

  expect(() => cancel()).not.toThrow()

  expect(callback).toHaveBeenCalledOnce()
})

describe('listen mixin', () => {
  it('should expose on/off/once', () => {
    class Class extends Emitter.listenMixin<{ event: [number] }>()(Object) {
      raiseEvent(x: number) {
        this._emit('event', x)
      }
    }

    const obj = new Class()
    const callback = vi.fn((x: number) => x)

    obj.once('event', callback)
    obj.on('event', callback)
    obj.off('event', callback)
    obj.raiseEvent(123)

    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith(123)
  })

  it('should keep the base class', () => {
    class Base {
      constructor(readonly field: number) {}
    }

    class Class extends Emitter.listenMixin()(Base) {}

    const obj = new Class(123)

    expect(obj.field).toEqual(123)
    expect(obj instanceof Base).toEqual(true)
  })
})
