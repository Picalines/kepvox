import { Slot as RadixSlot } from '@radix-ui/react-slot'
import type { Overlay } from '@repo/common/typing'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { cn } from '#lib/classnames'

const buttonVariants = cva(
  '-outline-offset-1 relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-input ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0',
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
        sm: 'h-8 px-3 [&:has(svg:only-child)]:p-1',
        md: 'h-10 px-4 py-2 [&:has(svg:only-child)]:p-2',
        lg: 'h-12 px-8 [&:has(svg:only-child)]:p-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export type ButtonProps = Overlay<
  ComponentProps<'button'>,
  VariantProps<typeof buttonVariants>,
  {
    /**
     * @example
     * <Button asChild>
     *   <Link href="/path">Link</Link>
     * </Button>
     */
    asChild?: boolean
  }
>

export type ButtonVariant = NonNullable<ButtonProps['variant']>

export type ButtonSize = NonNullable<ButtonProps['size']>

export const Button: FC<ButtonProps> = ({ className, variant, size, asChild, ...props }) => {
  const Component = asChild ? RadixSlot : 'button'
  return <Component {...props} className={cn(buttonVariants({ variant, size }), className)} />
}
