import type { OmitExisting } from '@repo/common/typing'
import { type ComponentProps, type FC, type ReactNode, useId } from 'react'
import { VDownIcon, VUpIcon } from '#icons'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'
import { NumberInputHeadless } from './number-input-headless'
import { NumberInputStepButton } from './number-input-step-button'

export type RootProps = {
  className?: string
  name?: string
  value?: number
  defaultValue?: number
  step?: number
  disabled?: boolean
  required?: boolean
  onValueChange?: (value: number) => void
  children?: ReactNode
}

export type LabelProps = OmitExisting<ComponentProps<'label'>, 'color' | 'htmlFor'>

export const Label = createSlot({ name: 'Label' }).component<LabelProps>()

export const Root: FC<RootProps> = props => {
  const { className, children, onValueChange, ...inputProps } = props

  const { label } = useSlots(children, { label: Label })

  const inputId = useId()

  return (
    <div className={cn('relative h-10', className)}>
      <NumberInputStepButton
        stepDirection="up"
        onValueChange={onValueChange}
        className="group absolute top-0 right-0 flex h-1/2 w-11 items-center justify-center border-b border-l text-muted-foreground"
        tabIndex={-1}
      >
        <VUpIcon className="h-min w-4 opacity-50 transition-all group-hover:opacity-100" />
      </NumberInputStepButton>
      <NumberInputStepButton
        stepDirection="down"
        onValueChange={onValueChange}
        className="group absolute right-0 bottom-0 flex h-1/2 w-11 items-center justify-center border-l text-muted-foreground"
        tabIndex={-1}
      >
        <VDownIcon className="h-min w-4 opacity-50 transition-all group-hover:opacity-100" />
      </NumberInputStepButton>
      <NumberInputHeadless
        {...inputProps}
        id={inputId}
        onValueChange={onValueChange}
        className="peer h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background transition-all [appearance:textfield] file:border-0 file:bg-transparent file:font-medium file:text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder=" "
      />
      {label && (
        <label
          {...label.props}
          ref={label.ref}
          htmlFor={inputId}
          className={cn(
            '-translate-y-1/2 peer-focus-visible:-top-1 pointer-events-none absolute top-0 left-3 origin-left translate-x-[-2px] border-background border-x-[2px] bg-background text-muted-foreground text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus-visible:text-ring peer-focus-visible:text-xs peer-disabled:text-muted-foreground/50',
            label.props.className,
          )}
        >
          {label.children}
        </label>
      )}
    </div>
  )
}

Root.displayName = 'NumberInput'
