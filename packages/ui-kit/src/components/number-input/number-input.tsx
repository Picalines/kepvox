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
        className="absolute top-1 right-1 flex h-1/2 flex-col items-center text-muted-foreground opacity-50 transition-all hover:opacity-100"
      >
        <VUpIcon className="h-min w-6" />
      </NumberInputStepButton>
      <NumberInputStepButton
        stepDirection="down"
        onValueChange={onValueChange}
        className="absolute right-1 bottom-1 flex h-1/2 flex-col items-center text-muted-foreground opacity-50 transition-all hover:opacity-100"
      >
        <VDownIcon className="h-min w-6" />
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
            '-translate-y-1/2 peer-focus-visible:-top-1 pointer-events-none absolute top-0 left-3 origin-left translate-x-[-2px] border-background border-x-2 bg-background text-muted-foreground text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus-visible:text-ring peer-focus-visible:text-sm peer-disabled:opacity-50',
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
