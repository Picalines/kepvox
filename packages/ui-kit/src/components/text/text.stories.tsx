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
          <Text variant="text-s" color="muted" className="block">
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
    as: {
      table: { disable: true },
    },
    variant: {
      table: { disable: true },
    },
    color: {
      control: 'select',
      options: ['inherit', 'muted', 'destructive'] satisfies TextColor[],
    },
    italic: {
      control: 'boolean',
    },
    underline: {
      control: 'boolean',
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    text: 'The quick brown fox jumps over the lazy dog',
    color: 'inherit',
    weight: undefined,
    italic: false,
    underline: false,
  },
}
