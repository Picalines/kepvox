export const isOneOf = <T>(value: T, variants: NoInfer<T>[]): boolean => variants.includes(value)
