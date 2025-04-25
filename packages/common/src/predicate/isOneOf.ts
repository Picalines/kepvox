export const isOneOf = <T>(value: T, variants: readonly NoInfer<T>[]): boolean => variants.includes(value)
