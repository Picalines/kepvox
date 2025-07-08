import { Command as CmdkCommand } from 'cmdk'
import { type ChangeEventHandler, type FC, Fragment, type ReactNode } from 'react'
import { SearchIcon } from '#icons'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = {
  children: ReactNode
}

export type InputProps = {
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export type EmptyProps = {
  children: ReactNode
}

export type GroupProps = {
  children: ReactNode
}

export type LabelProps = {
  children: ReactNode
}

export type ItemProps = {
  value?: string
  keywords?: string[]
  disabled?: boolean
  children: ReactNode
  onSelect?: (value: string) => void
}

export const Input = createSlot({ name: 'Input', required: true }).component<InputProps>()

export const Empty = createSlot({ name: 'Empty' }).component<EmptyProps>()

export const Group = createSlot({ name: 'Group', repeatable: true }).component<GroupProps>()

export const Label = createSlot({ name: 'Label', required: true }).component<LabelProps>()

export const Item = createSlot({ name: 'Item', repeatable: true }).component<ItemProps>()

export const Root: FC<RootProps> = props => {
  const { children } = props

  const { input, empty, groups } = useSlots(children, { input: Input, empty: Empty, groups: Group })

  return (
    <CmdkCommand
      loop
      className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground"
    >
      <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CmdkCommand.Input
          {...input.props}
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <CmdkCommand.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
        <CmdkCommand.Empty className="py-6 text-center text-sm">{empty?.children}</CmdkCommand.Empty>
        {groups.map((group, index) => (
          <Fragment key={group.key ?? index}>
            {index > 0 && <CmdkCommand.Separator className="-mx-1 h-px bg-border" />}
            <GroupImpl {...group.props}>{group.children}</GroupImpl>
          </Fragment>
        ))}
      </CmdkCommand.List>
    </CmdkCommand>
  )
}

const GroupImpl: FC<GroupProps> = props => {
  const { children } = props

  const { label, items } = useSlots(children, { label: Label, items: Item })

  return (
    <CmdkCommand.Group
      className="overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs"
      heading={label.children}
    >
      {items.map((item, index) => (
        <CmdkCommand.Item
          key={item.key ?? index}
          {...item.props}
          className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          {item.children}
        </CmdkCommand.Item>
      ))}
    </CmdkCommand.Group>
  )
}
