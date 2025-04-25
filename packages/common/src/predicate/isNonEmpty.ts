export const isNonEmpty = <T>(array: readonly T[]): array is readonly [T, ...T[]] => {
  return array.length > 0
}
