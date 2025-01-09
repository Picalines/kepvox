export const take = <T>(array: readonly T[], maxLength: number): T[] => {
  if (Number.isNaN(maxLength)) {
    throw new Error('the maxLength argument is NaN')
  }

  if (maxLength < 0) {
    throw new Error('the maxLength argument is an invalid length')
  }

  if (maxLength >= array.length || maxLength === Number.POSITIVE_INFINITY) {
    return [...array]
  }

  const taken: T[] = []
  for (let i = 0; i < maxLength; i++) {
    taken.push(array[i] as T)
  }

  return taken
}
