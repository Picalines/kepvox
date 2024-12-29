import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipProvider } from '#components/tooltip'
import * as icons from './index'

export default {
  title: 'icons/All',

  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-wrap gap-2">
        {Object.entries(icons).map(([name, Icon]) => (
          <Tooltip.Root key={name}>
            <Tooltip.Trigger asChild>
              <div className="rounded-md border border-dashed p-1">
                <Icon size={40} />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content>{name.replace('Icon', '')}</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </TooltipProvider>
  ),
} satisfies Meta

type Story = StoryObj

export const Default: Story = {}
