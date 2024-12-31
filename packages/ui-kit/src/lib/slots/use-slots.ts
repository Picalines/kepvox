import type { ReactNode } from 'react'
import { SlotMap, type SlotMapOptions } from './slot-map'

export type UseSlotsProps = SlotMapOptions & {
  children: ReactNode
}

export function useSlots(props: UseSlotsProps): SlotMap {
  const { children, defaultSlot } = props

  return new SlotMap(children, { defaultSlot })
}
