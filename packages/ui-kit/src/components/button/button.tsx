import type { Overlay } from '@repo/common/typing'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { cn } from '#lib/classnames'

export const buttonVariants = cva(
  '-outline-offset-1 relative inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium text-sm outline-input ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'bg-background outline hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8',
      },
      shape: {
        pill: '',
        square: '',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        shape: 'square',
        className: 'p-4',
      },
      {
        size: 'md',
        shape: 'square',
        className: 'p-5',
      },
      {
        size: 'lg',
        shape: 'square',
        className: 'p-6',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'pill',
    },
  },
)

export type ButtonProps = Overlay<ComponentProps<'button'>, VariantProps<typeof buttonVariants>>

export type ButtonVariant = NonNullable<ButtonProps['variant']>

export type ButtonSize = NonNullable<ButtonProps['size']>

export type ButtonShape = NonNullable<ButtonProps['shape']>

export const Button: FC<ButtonProps> = ({ className, variant, size, shape, ...props }) => (
  <button {...props} className={cn(buttonVariants({ variant, size, shape }), className)} />
)
