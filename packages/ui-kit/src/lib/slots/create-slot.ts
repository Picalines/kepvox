import type { SlotComponent } from './slot'

export function createSlot<Props = {}>(name: string): SlotComponent<Props> {
  const Slot: SlotComponent<Props> = () => null

  Slot.displayName = `Slot(${name})`
  Slot.__slotName = name

  return Slot
}
