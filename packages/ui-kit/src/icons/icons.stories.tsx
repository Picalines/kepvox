import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from '#components/tooltip'
import * as icons from './index'

export default {
  title: 'components/Icons',

  render: () => (
    <Tooltip.Provider delayDuration={0}>
      <div className="flex flex-wrap gap-2">
        {Object.entries(icons).map(([name, Icon]) => (
          <Tooltip.Root key={name}>
            <Tooltip.Trigger>
              <div className="rounded-md border border-dashed p-1">
                <Icon size={40} />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content>{name.replace('Icon', '')}</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  ),
} satisfies Meta

type Story = StoryObj

export const Default: Story = {}
