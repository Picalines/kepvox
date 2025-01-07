import { Emitter } from './emitter'

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
