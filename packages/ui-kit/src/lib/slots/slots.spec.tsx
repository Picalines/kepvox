import { render, renderHook } from '@testing-library/react'
import type { FC, ReactNode } from 'react'
import { expect, it, vi } from 'vitest'
import { createSlot, useSlots } from '.'

it('should send slot props to parent', () => {
  const Slot = createSlot({ name: 'Slot' }).component<{ prop: number }>()

  const {
    result: {
      current: { slot },
    },
  } = renderHook(() => useSlots(<Slot prop={42} />, { slot: Slot }))

  expect(slot?.props).toStrictEqual({ prop: 42 })
})

it('should return null for missing slot', () => {
  const Slot1 = createSlot({ name: 'Slot1' }).component()
  const Slot2 = createSlot({ name: 'Slot2' }).component()

  const {
    result: {
      current: { slot1, slot2 },
    },
  } = renderHook(() => useSlots(<Slot1 />, { slot1: Slot1, slot2: Slot2 }))

  expect(slot1).not.toBeNull()
  expect(slot2).toBeNull()
})

it('should allow repeated slots if the option is specified', () => {
  const Item = createSlot({ name: 'Item', repeatable: true }).component()

  const receiveItems = vi.fn()

  const Slotted: FC<{ children: ReactNode }> = ({ children }) => {
    const { items } = useSlots(children, { items: Item })
    receiveItems(items)
    return null
  }

  expect(() => {
    render(
      <Slotted>
        <Item />
        <Item />
      </Slotted>,
    )
  }).not.toThrow()

  expect(receiveItems).toBeCalledWith([expect.anything(), expect.anything()])
})

it('should forbid duplicated non-repeatable slot', () => {
  const Slot = createSlot({ name: 'Slot' }).component()

  const Slotted: FC<{ children: ReactNode }> = ({ children }) => {
    useSlots(children, { Slot })

    return null
  }

  expect(() => {
    render(
      <Slotted>
        <Slot />
        <Slot />
      </Slotted>,
    )
  }).toThrow(/multiple/)
})

it("should forbid a slot that isn't defined in the arguments", () => {
  const Slot = createSlot({ name: 'Slot' }).component()

  expect(() => {
    renderHook(() => useSlots(<Slot />, {}))
  }).toThrow(/'Slot'/)
})

it('should forbid regular components', () => {
  expect(() => {
    renderHook(() => useSlots(<p>child</p>, {}))
  }).toThrowError(/non-slot/)
})
