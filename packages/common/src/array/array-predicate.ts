export const isNonEmpty = <T>(array: T[]): array is [T, ...T[]] => {
  return array.length > 0
}
