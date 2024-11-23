import { Children, type ReactNode } from 'react'
import { type RenderedSlot, type SlotComponent, isSlotComponent, isSlotElement } from './slot'

export type SlotMapOptions = {
  defaultSlot?: SlotComponent
}

export class SlotMap {
  readonly children?: ReactNode = undefined

  #slots: Map<SlotComponent, RenderedSlot>

  constructor(children: ReactNode, options: SlotMapOptions = {}) {
    const { defaultSlot } = options

    this.#slots = new Map()

    if (defaultSlot && !isSlotComponent(defaultSlot)) {
      throw new Error('defaultSlot should be a component created by createSlot')
    }

    const defaultContent: ReactNode[] = []

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
        defaultContent.push(child)
      }
    })

    const defaultSlotItem = defaultSlot ? this.#slots.get(defaultSlot) : undefined
    const hasContent = defaultContent.length > 0

    if (defaultSlotItem && hasContent) {
      throw new Error(
        `cannot append children to default slot '${defaultSlotItem.name}' while it's being used explicitly`,
      )
    }

    if (defaultSlotItem) {
      this.children = defaultSlotItem.children
    } else if (hasContent) {
      this.children = defaultContent
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
