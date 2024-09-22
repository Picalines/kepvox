import type { ElementType, HTMLAttributes, JSX, PropsWithoutRef, RefAttributes } from 'react'

export type InferElement<E extends ElementType> = E extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[E] extends HTMLAttributes<infer P>
    ? P
    : HTMLElement
  : HTMLElement

export type ElementProps<E extends ElementType, P = {}> = PropsWithoutRef<P> & RefAttributes<InferElement<E>>
