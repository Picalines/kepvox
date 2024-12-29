import { type VariantProps, cva } from 'class-variance-authority'
import { type ComponentProps, type ElementType, forwardRef } from 'react'
import { cn } from '#lib/classnames'

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
      primary: 'text-black dark:text-white',
      secondary: 'text-gray-500 dark:text-gray-400',
      positive: 'text-green-500 dark:text-green-400',
      negative: 'text-red-500 dark:text-red-500',
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

export type TextProps = ComponentProps<'span'> &
  VariantProps<typeof textVariants> & {
    as?: ElementType
  }

export type TextVariant = NonNullable<TextProps['variant']>

export type TextColor = NonNullable<TextProps['color']>

export type TextWeight = NonNullable<TextProps['weight']>

export const Text = forwardRef<HTMLSpanElement, TextProps>((props, ref) => {
  const { as: Element = 'span', className, variant, color, weight, italic, underline, ...restProps } = props

  return (
    <Element
      {...restProps}
      ref={ref}
      className={cn(textVariants({ variant, color, weight, italic, underline }), className)}
    />
  )
})

Text.displayName = 'Text'
