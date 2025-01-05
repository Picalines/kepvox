declare const __brand__: unique symbol

export type Branded<T, B extends string> = T & { [__brand__]: B }

/**
 * Returns the first argument, but with a brand added in TypeScript.
 * Runtime value stays the same
 *
 * Call it with caution, as there's no special checks that the
 * value actually aligns with the brand semantics
 */
export const createBrandedUnsafe = <B extends Branded<any, string>>(value: Omit<B, typeof __brand__>): B => value as B

export const createSafeBrand = <T, B extends string>(
  predicate: (value: T) => value is Branded<T, B>,
  error: string | ((value: T) => any),
) =>
  [
    predicate,
    (value: T) => {
      if (!predicate(value)) {
        throw typeof error === 'string' ? new Error(error) : error(value)
      }

      return value
    },
  ] as const
