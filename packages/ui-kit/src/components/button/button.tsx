import type { OmitExisting, Overlay } from '@repo/common/typing'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentType, FC, MouseEventHandler, ReactNode } from 'react'
import { Text as Typography } from '#components/text'
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
        sm: 'h-8 gap-1 px-1.5 text-sm [&_svg]:size-3',
        md: 'h-10 gap-1.5 px-3 py-2 text-base [&_svg]:size-4',
        lg: 'h-12 gap-2 px-4.5 text-lg [&_svg]:size-5',
      },
      feedback: {
        none: '',
        positive: 'text-green-500',
        negative: 'text-red-500',
        modified: 'text-blue-500',
      },
      _iconOnly: { true: '', false: '' },
    },
    compoundVariants: [
      { _iconOnly: true, size: 'sm', class: 'px-2.5' },
      { _iconOnly: true, size: 'md', class: 'py-3' },
      { _iconOnly: true, size: 'lg', class: 'px-3.5' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      feedback: 'none',
    },
  },
)

export type RootProps = Overlay<
  OmitExisting<VariantProps<typeof buttonVariants>, '_iconOnly'>,
  {
    children: ReactNode
    className?: string
    disabled?: boolean
    onClick?: MouseEventHandler<HTMLButtonElement>
    onMouseDown?: MouseEventHandler<HTMLButtonElement>
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
  const { children, className: classNameProp, variant, size, feedback, ...rootProps } = props

  const { text, icon } = useSlots(children, { text: Text, icon: Icon })

  if (!text && !icon) {
    throw new Error(`${Root.displayName} requires ${Text.displayName} or ${Icon.displayName}`)
  }

  const buttonClassName = buttonVariants({ variant, size, feedback, _iconOnly: Boolean(icon && !text?.children) })
  const className = cn(buttonClassName, classNameProp)

  const iconPosition = icon?.props.position ?? 'end'
  const StartIcon = icon && iconPosition === 'start' ? icon.props.icon : null
  const EndIcon = icon && iconPosition === 'end' ? icon.props.icon : null

  return (
    <button {...rootProps} className={className}>
      {StartIcon && <StartIcon />}
      {text?.children && <Typography>{text.children}</Typography>}
      {EndIcon && <EndIcon />}
    </button>
  )
}

Root.displayName = 'Button'
