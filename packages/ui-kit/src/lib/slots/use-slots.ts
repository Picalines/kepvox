import { assertDefined } from '@repo/common/assert'
import { Children, type ReactElement, type ReactNode } from 'react'
import { isFragment } from 'react-is'
import { type RenderedSlot, type SlotComponent, type SlotMeta, isSlotElement } from './slot'

// NOTE: we don't use any memoization here, because we want this
// to be available at the server

export function useSlots<const SlotMap extends Record<string, SlotComponent<any, SlotMeta>>>(
  children: ReactNode,
  slotMap: SlotMap,
): {
  [S in keyof SlotMap]: SlotMap[S] extends SlotComponent<infer Props, infer Meta>
    ? Meta['repeatable'] extends true
      ? RenderedSlot<Props>[]
      : RenderedSlot<Props> | (Meta['required'] extends true ? never : null)
    : never
} {
  const collectedSlots: Record<string, RenderedSlot<any>[] | RenderedSlot<any> | null> = {}
  const slotNameToResultKey: Record<string, string> = {}
  for (const outputKey in slotMap) {
    const slot = slotMap[outputKey as string]
    assertDefined(slot)

    collectedSlots[outputKey] = slot.__slot.repeatable ? [] : null
    slotNameToResultKey[slot.__slot.name] = outputKey
  }

  forEachNonFragment(children, child => {
    if (child === null || child === undefined || child === false || child === '') {
      return // allow conditional elements
    }

    if (!isSlotElement(child)) {
      throw new Error(`non-slot component passed to ${useSlots.name}`)
    }

    const {
      type: {
        __slot: { name },
      },
      props: { children: slotChildren, ref, ...props },
      key,
    } = child

    const resultKey = slotNameToResultKey[name]
    if (resultKey === undefined) {
      throw new Error(`slot '${name}' wasn't defined in the useSlot arguments`)
    }

    const renderedSlot: RenderedSlot<any> = { name, children: slotChildren, props, ref, key }

    if (Array.isArray(collectedSlots[resultKey])) {
      collectedSlots[resultKey].push(renderedSlot)
    } else {
      if (collectedSlots[resultKey]) {
        throw new Error(`non-repeatable slot '${name}' is being rendered multiple times`)
      }

      collectedSlots[resultKey] = renderedSlot
    }
  })

  for (const outputKey in slotMap) {
    const slot = slotMap[outputKey as string]
    if (slot?.__slot.required && collectedSlots[outputKey] === null) {
      throw new Error(`slot '${slot.__slot.name}' is required`)
    }
  }

  // @ts-expect-error: typing this properly seems impossible
  return collectedSlots
}

const forEachNonFragment = (children: ReactNode, fn: (child: ReactNode) => void) => {
  Children.forEach(children, child => {
    if (isFragmentWithChildren(child)) {
      forEachNonFragment(child.props.children, fn)
    } else {
      fn(child)
    }
  })
}

function isFragmentWithChildren(node: unknown): node is ReactElement<{ children: ReactNode }> {
  return isFragment(node)
}
