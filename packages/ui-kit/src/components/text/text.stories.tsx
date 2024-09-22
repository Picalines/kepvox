import type { Meta, StoryObj } from '@storybook/react'

import { Text, type TextColor, type TextProps, type TextVariant } from './text'

type StoryArgs = TextProps & { text: string }

const fontVariants = ['heading-xl', 'heading-m', 'text-l', 'text-m', 'text-s', 'text-xs'] satisfies TextVariant[]

export default {
  title: 'components/Text',
  component: Text,
  render: ({ text, ...args }) => (
    <div className="flex flex-col gap-2">
      {fontVariants.map(variant => (
        <div key={variant}>
          <Text variant="text-s" color="secondary" className="block">
            {variant}
          </Text>
          <Text variant={variant} className="block" {...args}>
            {text}
          </Text>
        </div>
      ))}
    </div>
  ),
  argTypes: {
    variant: {
      table: { disable: true },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'positive', 'negative'] satisfies TextColor[],
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    text: 'The quick brown fox jumps over the lazy dog',
    color: 'primary',
  },
}
