import { describe, expect, it, vi } from 'vitest'
import { type Disposable, DisposableStack } from './disposable'

const disposableFn = (implementation: (...args: any[]) => void) => {
  const controller = new AbortController()
  const fn = vi.fn(() => {
    controller.abort()
    implementation()
  })
  const disposable: Disposable = { dispose: fn, disposed: controller.signal }
  return { fn, disposable }
}

describe('DisposableStack', () => {
  it('calls the dispose method in reverse order', () => {
    const calls: number[] = []

    const { disposable: disposable1 } = disposableFn(() => calls.push(1))
    const { disposable: disposable2 } = disposableFn(() => calls.push(2))
    const { disposable: disposable3 } = disposableFn(() => calls.push(3))

    const stack = new DisposableStack([disposable1])
    stack.add(disposable2)
    stack.add(disposable3)

    stack.dispose()

    expect(calls).toStrictEqual([3, 2, 1])
  })

  it('calls the dispose method only one time', () => {
    const calls: number[] = []

    const { disposable: disposable1 } = disposableFn(() => calls.push(1))
    const { disposable: disposable2 } = disposableFn(() => calls.push(2))
    const { disposable: disposable3 } = disposableFn(() => calls.push(3))

    const stack = new DisposableStack([disposable1])
    stack.add(disposable2)
    stack.add(disposable2)
    stack.add(disposable3)
    stack.add(disposable3)
    stack.add(disposable2)
    stack.add(disposable1)

    stack.dispose()

    expect(calls).toStrictEqual([3, 2, 1])
  })
})
