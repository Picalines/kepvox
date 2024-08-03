import type { FC, JSXElementConstructor, PropsWithChildren, ReactElement, ReactNode, Ref, RefAttributes } from 'react'
import { isValidElement } from 'react'

export type SlotComponent<Props = {}, Type = unknown> = FC<Props & RefAttributes<Type>> & {
  /**
   * @internal
   */
  __slotName: string
}

export type RenderedSlot<Props = {}, Type = unknown> = {
  name: string
  props: PropsWithChildren<Props>
  children: ReactNode
  ref?: Ref<Type>
}

export function isSlotElement<P = {}, Type = never>(
  node: ReactNode,
): node is ReactElement<PropsWithChildren<P>, SlotComponent<P>> & RefAttributes<Type> {
  return isValidElement(node) && isSlotComponent(node.type)
}

export function isSlotComponent<T = {}>(
  type: string | JSXElementConstructor<T & RefAttributes<unknown>>,
): type is SlotComponent<T> {
  return typeof type === 'function' && '__slotName' in type
}
