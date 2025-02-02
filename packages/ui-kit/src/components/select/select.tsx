import * as RadixSelect from '@radix-ui/react-select'
import type { OmitExisting, Overlay } from '@repo/common/typing'
import { type ComponentPropsWithRef, type FC, type Key as ReactKey, type ReactNode, useId } from 'react'
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
  disabled?: boolean
  required?: boolean
  onValueChange?: (value: string) => void
}

export type LabelProps = Overlay<OmitExisting<ComponentPropsWithRef<'div'>, 'id'>, { children: ReactNode }>

export type TriggerProps = {
  className?: string
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

export type HeaderProps = Overlay<
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
    disabled?: boolean
  }
>

export const Label = createSlot({ name: 'Label' }).component<LabelProps>()
export const Trigger = createSlot({ name: 'Trigger' }).component<TriggerProps>()
export const Content = createSlot({ name: 'Content' }).component<ContentProps>()
export const Group = createSlot({ name: 'Group', repeatable: true }).component<GroupProps>()
export const Header = createSlot({ name: 'Header' }).component<HeaderProps>()
export const Item = createSlot({ name: 'Item', repeatable: true }).component<ItemProps>()

export const Root: FC<RootProps> = props => {
  const { children, ...rootProps } = props

  const { label, trigger, content } = useSlots(children, { label: Label, trigger: Trigger, content: Content })
  const { groups } = useSlots(content?.children, { groups: Group })

  const labelId = useId()

  return (
    <RadixSelect.Root {...rootProps}>
      {trigger && (
        <div className="relative">
          <RadixSelect.Trigger
            aria-labelledby={label ? labelId : undefined}
            className={cn(
              'peer flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
              trigger.props.className,
            )}
          >
            <RadixSelect.Value />
            <RadixSelect.Icon asChild>
              <VDownIcon className="h-4 w-4 opacity-50" />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
          {label && (
            <div
              {...label.props}
              ref={label.ref}
              id={labelId}
              className={cn(
                '-translate-y-1/2 peer-focus-visible:-top-1 pointer-events-none absolute top-0 left-3 origin-left translate-x-[-2px] border-background border-x-2 bg-background text-muted-foreground text-sm transition-all peer-focus-visible:text-ring peer-disabled:opacity-50 peer-data-placeholder:top-1/2 peer-data-placeholder:text-base peer-data-placeholder:text-muted-foreground',
                label.props.className,
              )}
            >
              {label.children}
            </div>
          )}
        </div>
      )}
      {content && (
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1"
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

  const { label, items } = useSlots(children, { label: Header, items: Item })

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
            'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
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
