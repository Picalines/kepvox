declare const __synthBrand: unique symbol

export type Branded<T, B extends string> = T & { [__synthBrand]: B }
