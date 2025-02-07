import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { allSettled, fork } from 'effector'
import { Provider } from 'effector-react'
import type { ComponentProps } from 'react'
import { model } from '../model'
import { EditorHeader } from './editor-header'

type StoryArgs = ComponentProps<typeof EditorHeader>

const scope = fork()

await allSettled(model.initialized, { scope })

export default {
  title: 'screens/EditorScreen/EditorHeader',
  component: EditorHeader,
  decorators: [
    Story => (
      <Tooltip.Provider>
        <Provider value={scope}>
          <div className="flex h-20 flex-col">
            <Story />
          </div>
        </Provider>
      </Tooltip.Provider>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Idle: Story = {}
