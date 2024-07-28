import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function tw(strings: readonly string[] | ArrayLike<string>, ...values: readonly unknown[]) {
  return String.raw({ raw: strings }, ...values)
}
