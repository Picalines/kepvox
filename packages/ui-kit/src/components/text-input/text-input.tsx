import {
  type ChangeEventHandler,
  type ComponentProps,
  type FC,
  type FocusEventHandler,
  type ReactNode,
  type RefObject,
  useId,
} from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type InputType = 'text' | 'password'

export type RootProps = {
  className?: string
  value?: string
  defaultValue?: string
  inputRef?: RefObject<HTMLInputElement>
  disabled?: boolean
  required?: boolean
  type?: InputType
  onChange?: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  children: ReactNode
}

export type LabelProps = Omit<ComponentProps<'label'>, 'color'>

export const Label = createSlot({ name: 'Label' }).component<LabelProps>()

export const Root: FC<RootProps> = props => {
  const {
    className,
    value,
    defaultValue,
    inputRef,
    disabled = false,
    required = false,
    type,
    children,
    ...inputProps
  } = props

  const { label } = useSlots(children, { label: Label })

  const inputId = useId()

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        id={inputId}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          'peer h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background transition-all file:border-0 file:bg-transparent file:font-medium file:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        )}
        placeholder=" "
        disabled={disabled}
        required={required}
        type={type}
        {...inputProps}
      />
      {label && (
        <label
          {...label.props}
          ref={label.ref}
          htmlFor={inputId}
          className={cn(
            '-translate-y-1/2 peer-focus:-top-1 pointer-events-none absolute top-0 left-3 origin-left translate-x-[-2px] border-background border-x-2 bg-background text-muted-foreground text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:text-ring peer-focus:text-sm peer-disabled:opacity-50',
            label.props.className,
          )}
        >
          {label.children}
        </label>
      )}
    </div>
  )
}

Root.displayName = 'Input'
