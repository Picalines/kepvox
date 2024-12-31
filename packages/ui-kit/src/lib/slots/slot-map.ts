import { Children, type ReactNode } from 'react'
import { type RenderedSlot, type SlotComponent, isSlotComponent, isSlotElement } from './slot'

export type SlotMapOptions = {
  defaultSlot?: SlotComponent
}

export class SlotMap {
  #slots: Map<SlotComponent, RenderedSlot>

  constructor(children: ReactNode, options: SlotMapOptions = {}) {
    const { defaultSlot } = options

    this.#slots = new Map()

    if (defaultSlot && !isSlotComponent(defaultSlot)) {
      throw new Error('defaultSlot should be a component created by createSlot')
    }

    const nonSlotNodes: ReactNode[] = []

    Children.forEach(children, child => {
      if (isSlotElement(child)) {
        const { type, props, ref } = child

        if (this.#slots.has(type)) {
          throw new Error(`slot '${type.__slotName}' is being rendered twice`)
        }

        this.#slots.set(type, {
          name: type.__slotName,
          props,
          children: props.children,
          ref,
        })
      } else if (child !== null && child !== undefined && child !== '') {
        nonSlotNodes.push(child)
      }
    })

    if (nonSlotNodes.length) {
      if (!defaultSlot) {
        throw new Error('non-slot components without the defaultSlot option are not allowed')
      }

      if (this.#slots.size) {
        throw new Error('mixing slot and non-slot components is not allowed')
      }

      this.#slots.set(defaultSlot, {
        name: defaultSlot.__slotName,
        props: {},
        children: nonSlotNodes,
      })
    }
  }

  get<Props>(slot: SlotComponent<Props>): RenderedSlot<Props> | undefined {
    if (!isSlotComponent(slot)) {
      throw new Error('invalid slot component, should be created by createSlot')
    }

    // @ts-expect-error #slots is a generic collection, can't expect concrete inference
    return this.#slots.get(slot)
  }
}
