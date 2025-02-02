import * as RadixCheckbox from '@radix-ui/react-checkbox'
import type { OmitExisting } from '@repo/common/typing'
import { type ComponentProps, type FC, type ReactNode, useId } from 'react'
import { CheckIcon } from '#icons'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = {
  className?: string
  name?: string
  /**
   * @default "on"
   */
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  children: ReactNode
  onCheckedChange?: (checked: boolean) => void
}

export type LabelProps = OmitExisting<ComponentProps<'label'>, 'color' | 'htmlFor'>

export const Label = createSlot({ name: 'Label' }).component<LabelProps>()

export const Root: FC<RootProps> = props => {
  const { className, children, ...rootProps } = props

  const { label } = useSlots(children, { label: Label })

  const checkboxId = useId()

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <RadixCheckbox.Root
        {...rootProps}
        id={checkboxId}
        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      >
        <RadixCheckbox.Indicator className="flex items-center justify-center text-current">
          <CheckIcon className="h-4 w-4" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label
          {...label.props}
          ref={label.ref}
          htmlFor={checkboxId}
          className={cn('peer-disabled:opacity-50', label.props.className)}
        >
          {label.children}
        </label>
      )}
    </div>
  )
}

Root.displayName = 'Checkbox'
