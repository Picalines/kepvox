import type {
  FC,
  JSXElementConstructor,
  PropsWithChildren,
  PropsWithoutRef,
  ReactElement,
  ReactNode,
  RefAttributes,
} from 'react'
import { isValidElement } from 'react'

export type SlotComponent<Props = {}> = FC<Props> & {
  /**
   * @internal
   */
  __slotName: string
}

type ExplicitRefProps<Props> = Props extends RefAttributes<infer T> ? RefAttributes<T> : {}

export type RenderedSlot<Props = {}> = {
  name: string
  props: PropsWithoutRef<PropsWithChildren<Props>>
  children: ReactNode
} & ExplicitRefProps<Props>

export function isSlotElement<Props = {}>(
  node: ReactNode,
): node is ReactElement<PropsWithChildren<Props>, SlotComponent<Props>> & ExplicitRefProps<Props> {
  return isValidElement(node) && isSlotComponent(node.type)
}

export function isSlotComponent<Props = {}>(
  type: string | JSXElementConstructor<Props & RefAttributes<unknown>>,
): type is SlotComponent<Props> {
  return typeof type === 'function' && '__slotName' in type
}
