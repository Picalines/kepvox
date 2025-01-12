import type { Tuple } from '#typing'

export const isNonEmpty = <T>(array: T[]): array is [T, ...T[]] => {
  return array.length > 0
}

export const isTuple = <T, const L extends number>(
  array: T[],
  length: L,
): array is number extends L ? T[] : Tuple<T, L> => {
  return array.length === length
}
