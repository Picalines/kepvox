import type { Meta, StoryObj } from '@storybook/react'

import { Heading } from '.'

type StoryArgs = Heading.RootProps & Partial<{ superTitle: string; title: string; description: string }>

export default {
  title: 'components/Heading',
  component: Heading.Root,
  render: ({ className, superTitle, title, description, ...args }) => (
    <Heading.Root className={className} {...args}>
      {superTitle ? <Heading.SuperTitle>{superTitle}</Heading.SuperTitle> : null}
      {title ? <Heading.Title>{title}</Heading.Title> : null}
      {description ? <Heading.Description>{description}</Heading.Description> : null}
    </Heading.Root>
  ),
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    superTitle: 'SuperTitle',
    title: 'Title',
    description: 'Description',
  },
}
