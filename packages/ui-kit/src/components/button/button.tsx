import type { Overlay } from '@repo/common/typing'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentType, FC, ReactNode } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

const buttonVariants = cva(
  '-outline-offset-1 relative inline-flex w-fit items-center justify-center whitespace-nowrap rounded-md font-medium outline-input ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/60',
        outline: 'bg-background outline hover:bg-accent',
        ghost: 'hover:bg-accent',
      },
      size: {
        sm: 'h-8 gap-1 px-1.5 text-sm [&:has(svg:only-child)]:px-2.5 [&_svg]:size-3',
        md: 'h-10 gap-1.5 px-3 py-2 text-base [&:has(svg:only-child)]:py-3 [&_svg]:size-4',
        lg: 'h-12 gap-2 px-4.5 text-lg [&:has(svg:only-child)]:px-3.5 [&_svg]:size-5',
      },
      feedback: {
        none: '',
        positive: 'text-green-500',
        negative: 'text-red-500',
        modified: 'text-blue-500',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      feedback: 'none',
    },
  },
)

export type RootProps = Overlay<
  VariantProps<typeof buttonVariants>,
  {
    children: ReactNode
    className?: string
    disabled?: boolean
    onClick?: () => void
    onMouseDown?: () => void
  }
>

export type TextProps = {
  children: string | string[]
}

export type IconProps = {
  icon: ComponentType
  position?: 'start' | 'end'
}

export const Text = createSlot({ name: 'Text' }).component<TextProps>()

export const Icon = createSlot({ name: 'Icon' }).component<IconProps>()

export const Root: FC<RootProps> = props => {
  const { children, className, variant, size, feedback, ...buttonProps } = props

  const { text, icon } = useSlots(children, { text: Text, icon: Icon })

  if (!text && !icon) {
    throw new Error(`${Root.displayName} requires ${Text.displayName} or ${Icon.displayName}`)
  }

  const buttonClassName = buttonVariants({ variant, size, feedback })

  const iconPosition = icon?.props.position ?? 'end'
  const StartIcon = icon && iconPosition === 'start' ? icon.props.icon : null
  const EndIcon = icon && iconPosition === 'end' ? icon.props.icon : null

  return (
    <button {...buttonProps} className={cn(buttonClassName, className)}>
      {StartIcon && <StartIcon />}
      {text?.children && <span>{text.children}</span>}
      {EndIcon && <EndIcon />}
    </button>
  )
}

Root.displayName = 'Button'
