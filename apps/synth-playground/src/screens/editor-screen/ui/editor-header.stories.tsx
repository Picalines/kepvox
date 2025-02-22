import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { allSettled, fork } from 'effector'
import { Provider } from 'effector-react'
import type { ComponentProps } from 'react'
import { EditorHeader } from './editor-header'
import { EditorScreenGate } from './editor-screen-gate'

type StoryArgs = ComponentProps<typeof EditorHeader>

const scope = fork()

await allSettled(scope)

export default {
  title: 'screens/EditorScreen/EditorHeader',
  component: EditorHeader,
  decorators: [
    Story => (
      <Tooltip.Provider>
        <Provider value={scope}>
          <EditorScreenGate />
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
