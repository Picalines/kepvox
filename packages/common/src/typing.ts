/**
 * Like standard `Omit`, but requires the keys to be in `T`
 */
export type OmitExisting<T, K extends keyof T> = { [P in keyof T as P extends K ? never : P]: T[P] }

export type Override<T extends object, O extends Partial<Record<keyof T, any>>> = {
  [K in keyof T as K extends keyof O ? never : K]: T[K]
} & O

type Overlay2<T extends object, O extends Partial<Record<keyof T, any>> & object> = {
  [K in keyof T as K extends keyof O ? never : K]: T[K]
} & O

/**
 * Like `Override`, but allows to add additional properties
 */
export type Overlay<
  T extends object,
  O1 extends Partial<Record<keyof T, any>> & object,
  O2 extends Partial<Record<keyof T, any>> & object = {},
  O3 extends Partial<Record<keyof T, any>> & object = {},
  O4 extends Partial<Record<keyof T, any>> & object = {},
> = Overlay2<T, Overlay2<O1, Overlay2<O2, Overlay2<O3, O4>>>>

export type SetRequired<T, K extends keyof T> = OmitExisting<T, K> & Required<Pick<T, K>>

export type SetOptional<T, K extends keyof T> = OmitExisting<T, K> & Partial<Pick<T, K>>

type TupleImpl<Item, Length extends number, Acc extends Item[]> = Acc extends {
  length: Length
}
  ? Acc
  : TupleImpl<Item, Length, [...Acc, Item]>

export type Tuple<Item, Length extends number> = `${Length}` extends `-${string}` ? never : TupleImpl<Item, Length, []>
