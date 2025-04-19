import type { OmitExisting } from '@repo/common/typing'
import { type ComponentProps, type FC, type ReactNode, useId } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'
import { TextInputHeadless } from './text-input-headless'

export type InputType = 'text' | 'password'

export type RootProps = {
  className?: string
  name?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  type?: InputType
  onValueChange?: (value: string) => void
  children?: ReactNode
}

export type LabelProps = OmitExisting<ComponentProps<'label'>, 'color' | 'htmlFor'>

export const Label = createSlot({ name: 'Label' }).component<LabelProps>()

export const Root: FC<RootProps> = props => {
  const { className, children, ...inputProps } = props

  const { label } = useSlots(children, { label: Label })

  const inputId = useId()

  return (
    <div className={cn('relative', className)}>
      <TextInputHeadless
        {...inputProps}
        id={inputId}
        className="peer h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background transition-all file:border-0 file:bg-transparent file:font-medium file:text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder=" "
      />
      {label && (
        <label
          {...label.props}
          ref={label.ref}
          htmlFor={inputId}
          className={cn(
            '-translate-y-1/2 peer-focus-visible:-top-1 pointer-events-none absolute top-0 left-3 origin-left translate-x-[-2px] border-background border-x-[2px] bg-background text-muted-foreground text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus-visible:text-ring peer-focus-visible:text-sm peer-disabled:text-muted-foreground/50',
            label.props.className,
          )}
        >
          {label.children}
        </label>
      )}
    </div>
  )
}

Root.displayName = 'TextInput'
