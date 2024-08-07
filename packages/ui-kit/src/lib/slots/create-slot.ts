import type { RefAttributes } from 'react'
import type { SlotComponent } from './slot'

type RefType<Props> = Props extends RefAttributes<infer T> ? (unknown extends T ? never : T) : never

export function createSlot<Props = {}, Type = RefType<Props>>(name: string): SlotComponent<Props, Type> {
  const Slot: SlotComponent<Props, Type> = () => null

  Slot.displayName = `Slot(${name})`
  Slot.__slotName = name

  return Slot
}
