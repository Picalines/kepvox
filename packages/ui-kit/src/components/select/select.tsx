import * as RadixSelect from '@radix-ui/react-select'
import type { Overlay } from '@repo/common/typing'
import type { ComponentPropsWithRef, FC, Key as ReactKey, ReactNode } from 'react'
import { CheckIcon, VDownIcon, VUpIcon } from '#icons'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = {
  children: ReactNode
  name?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (opened: boolean) => void
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

export type TriggerProps = {
  className?: string
  placeholder: string
}

export type ContentProps = {
  children: ReactNode
}

export type GroupProps = Overlay<
  ComponentPropsWithRef<'div'>,
  {
    children: ReactNode
    key?: ReactKey
  }
>

export type LabelProps = Overlay<
  ComponentPropsWithRef<'div'>,
  {
    children: ReactNode
  }
>

export type ItemProps = Overlay<
  ComponentPropsWithRef<'div'>,
  {
    children: ReactNode
    value: string
  }
>

export const Trigger = createSlot({ name: 'Trigger' }).component<TriggerProps>()
export const Content = createSlot({ name: 'Content' }).component<ContentProps>()
export const Group = createSlot({ name: 'Group', repeatable: true }).component<GroupProps>()
export const Label = createSlot({ name: 'Label' }).component<LabelProps>()
export const Item = createSlot({ name: 'Item', repeatable: true }).component<ItemProps>()

export const Root: FC<RootProps> = props => {
  const { children, ...rootProps } = props

  const { trigger, content } = useSlots(children, { trigger: Trigger, content: Content })
  const { groups } = useSlots(content?.children, { groups: Group })

  return (
    <RadixSelect.Root {...rootProps}>
      {trigger && (
        <RadixSelect.Trigger
          className={cn(
            'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            trigger.props.className,
          )}
        >
          <RadixSelect.Value placeholder={trigger.props.placeholder} />
          <RadixSelect.Icon asChild>
            <VDownIcon className="h-4 w-4 opacity-50" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
      )}
      {content && (
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1 data-[state=closed]:animate-out data-[state=open]:animate-in"
          >
            <RadixSelect.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
              <VUpIcon className="h-4 w-4" />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport className="h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] p-1">
              {groups.map((group, index) => (
                <SelectGroup {...group.props} ref={group.ref} key={group.key ?? index}>
                  {group.children}
                </SelectGroup>
              ))}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
              <VDownIcon className="h-4 w-4" />
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      )}
    </RadixSelect.Root>
  )
}

Root.displayName = 'Select'

const SelectGroup: FC<GroupProps> = props => {
  const { children, ...groupProps } = props

  const { label, items } = useSlots(children, { label: Label, items: Item })

  return (
    <RadixSelect.Group {...groupProps}>
      {label && (
        <RadixSelect.Label
          {...label.props}
          ref={label.ref}
          asChild={false}
          className={cn('px-2 py-1.5 font-semibold text-sm', label.props.className)}
        >
          {label.children}
        </RadixSelect.Label>
      )}
      {items.map(({ children: text, props: itemProps, ref, key }) => (
        <RadixSelect.Item
          {...itemProps}
          ref={ref}
          key={key ?? itemProps.value}
          className={cn(
            'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            itemProps.className,
          )}
        >
          <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
            <RadixSelect.ItemIndicator>
              <CheckIcon className="h-4 w-4" />
            </RadixSelect.ItemIndicator>
          </span>
          <RadixSelect.ItemText>{text}</RadixSelect.ItemText>
        </RadixSelect.Item>
      ))}
    </RadixSelect.Group>
  )
}
