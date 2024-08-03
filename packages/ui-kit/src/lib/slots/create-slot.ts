import type { SlotComponent } from './slot'

export function createSlot<Props = {}, Type = never>(name: string): SlotComponent<Props, Type> {
  const Slot: SlotComponent<Props, Type> = () => null

  Slot.displayName = `Slot(${name})`
  Slot.__slotName = name

  return Slot
}
