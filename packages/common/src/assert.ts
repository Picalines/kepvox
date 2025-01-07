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
