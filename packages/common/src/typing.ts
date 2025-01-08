/**
 * Like standard `Omit`, but requires the keys to be in `T`
 */
export type OmitExisting<T, K extends keyof T> = { [P in keyof T as P extends K ? never : P]: T[P] }

export type Override<T extends object, O extends Partial<Record<keyof T, any>>> = {
  [K in keyof T as K extends keyof O ? never : K]: T[K]
} & O

/**
 * Like `Override`, but allows to add additional properties
 */
export type Overlay<T extends object, O extends Partial<Record<keyof T, any>> & object> = {
  [K in keyof T as K extends keyof O ? never : K]: T[K]
} & O
