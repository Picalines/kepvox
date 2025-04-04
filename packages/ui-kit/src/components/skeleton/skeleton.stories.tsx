import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { tw } from '#lib/classnames'
import { Skeleton } from './skeleton'

type StoryArgs = ComponentProps<typeof Skeleton>

export default {
  title: 'components/Skeleton',
  component: Skeleton,
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    className: tw`h-16 w-32`,
  },
}
