import type { Overlay } from '@repo/common/typing'
import { type VariantProps, cva } from 'class-variance-authority'
import type { FC, ReactNode } from 'react'

const textVariants = cva('', {
  variants: {
    variant: {
      'heading-xl': 'font-bold text-2xl',
      'heading-m': 'font-semibold text-xl',
      'text-l': 'text-lg',
      'text-m': 'text-base',
      'text-s': 'text-sm',
      'text-xs': 'text-xs',
    },
    color: {
      inherit: 'text-inherit',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      accent: 'text-accent-foreground',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    italic: {
      true: 'italic',
      false: 'not-italic',
    },
    underline: {
      true: 'underline underline-offset-2',
      false: 'no-underline',
    },
  },
  defaultVariants: {
    variant: 'text-m',
    color: 'inherit',
  },
})

export type TextProps = Overlay<
  VariantProps<typeof textVariants>,
  {
    children?: ReactNode
  }
>

export type TextVariant = NonNullable<TextProps['variant']>

export type TextColor = NonNullable<TextProps['color']>

export type TextWeight = NonNullable<TextProps['weight']>

export const Text: FC<TextProps> = props => {
  const { variant, color, weight, italic, underline, ...elementProps } = props

  return <span {...elementProps} className={textVariants({ variant, color, weight, italic, underline })} />
}
