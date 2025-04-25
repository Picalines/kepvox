import type { Tuple } from '#typing'

export const isTuple = <T, const L extends number>(
  array: readonly T[],
  length: L,
): array is number extends L ? readonly T[] : Tuple<T, L> => {
  return array.length === length
}
