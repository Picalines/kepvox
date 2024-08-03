import { type ReactNode, useMemo } from 'react'
import { SlotMap, type SlotMapOptions } from './slot-map'

export type UseSlotsProps = SlotMapOptions & {
  children: ReactNode
}

export function useSlots(props: UseSlotsProps): SlotMap {
  const { children, defaultSlot } = props

  return useMemo(() => new SlotMap(children, { defaultSlot }), [children, defaultSlot])
}
