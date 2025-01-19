class AssertionError extends Error {}

export function assertTrue(condition: boolean, errorMessage = 'asserted condition not met'): asserts condition {
  if (!condition) {
    throw new AssertionError(errorMessage)
  }
}

export function assertDefined<T>(
  value: T | undefined | null,
  errorMessage = 'the value is null or undefined',
): asserts value is T {
  if (value === undefined || value === null) {
    throw new AssertionError(errorMessage)
  }
}

export function assertUnreachable(stateDescription: string): never {
  throw new AssertionError(`unreachable state reached: ${stateDescription}`)
}

export function assertedAt<T>(array: readonly T[], atIndex: number, errorMessage?: string): T {
  const item = array.at(atIndex)
  assertDefined(item, errorMessage ?? `array item at index ${atIndex} not found`)
  return item
}
