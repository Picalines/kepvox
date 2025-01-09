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

/**
 * @internal
 */
export type SlotMeta = {
  name: string
  repeatable?: boolean
}

export type SlotComponent<Props, Meta extends SlotMeta> = FC<Props> & {
  /**
   * @internal
   */
  __slot: Meta
}

type ExplicitRefProps<Props> = Props extends RefAttributes<infer T> ? RefAttributes<T> : {}

export type RenderedSlot<Props = {}> = {
  name: string
  props: PropsWithoutRef<PropsWithChildren<Props>>
  children: ReactNode
  key: string | null
} & ExplicitRefProps<Props>

export const createSlot = <const Meta extends SlotMeta>(meta: Meta) =>
  ({
    component: <Props = {}>(): SlotComponent<Props, Meta> => {
      const Slot: SlotComponent<Props, Meta> = () => null

      Slot.displayName = `Slot(${meta.name})`
      Slot.__slot = meta

      return Slot
    },
  }) as const

export function isSlotElement<Props = {}>(
  node: ReactNode,
): node is ReactElement<PropsWithChildren<Props>, SlotComponent<Props, SlotMeta>> & ExplicitRefProps<Props> {
  return isValidElement(node) && isSlotComponent(node.type)
}

export function isSlotComponent<Props = {}>(
  type: string | JSXElementConstructor<Props & RefAttributes<unknown>>,
): type is SlotComponent<Props, SlotMeta> {
  return typeof type === 'function' && '__slot' in type
}
