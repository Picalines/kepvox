import { renderHook } from '@testing-library/react'
import { createSlot, useSlots } from '.'

describe('feature', () => {
  it('should send slot props to parent', () => {
    const Slot = createSlot<{ prop: number }>('Slot')

    const {
      result: { current: slots },
    } = renderHook(useSlots, {
      initialProps: {
        children: <Slot prop={42} />,
      },
    })

    expect(slots.get(Slot)?.props).toStrictEqual({ prop: 42 })
  })

  it('should return undefined for missing slot', () => {
    const Slot1 = createSlot('Slot1')
    const Slot2 = createSlot('Slot2')

    const {
      result: { current: slots },
    } = renderHook(useSlots, {
      initialProps: {
        children: <Slot1 />,
      },
    })

    expect(slots.get(Slot1)).toBeDefined()
    expect(slots.get(Slot2)).toBeUndefined()
  })

  it('should send components to defaultSlot', () => {
    const Slot1 = createSlot('Slot1')
    const Slot2 = createSlot('Slot2')

    const {
      result: { current: slots },
    } = renderHook(useSlots, {
      initialProps: {
        defaultSlot: Slot1,
        children: <p>child</p>,
      },
    })

    expect(slots.get(Slot1)).toBeDefined()
    expect(slots.get(Slot2)).toBeUndefined()
  })
})

describe('error', () => {
  it('should forbid duplicated slot', () => {
    const Slot = createSlot('Slot')

    expect(() => {
      renderHook(useSlots, {
        initialProps: {
          children: (
            <>
              <Slot />
              <Slot />
            </>
          ),
        },
      })
    }).toThrowError()
  })

  it('should forbid components without defaultSlot', () => {
    expect(() => {
      renderHook(useSlots, {
        initialProps: {
          children: <p>child</p>,
        },
      })
    }).toThrowError()
  })

  it('should forbid components mixed with slots', () => {
    const Slot = createSlot('Slot')

    expect(() => {
      renderHook(useSlots, {
        initialProps: {
          children: (
            <>
              <Slot />
              <p>child</p>
            </>
          ),
        },
      })
    }).toThrowError()
  })
})
