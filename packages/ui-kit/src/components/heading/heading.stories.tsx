import type { Meta, StoryObj } from '@storybook/react'

import { Heading, type HeadingProps } from './heading'

type StoryArgs = HeadingProps & Partial<{ superTitle: string; title: string; description: string }>

export default {
  title: 'components/Heading',
  component: Heading,
  render: ({ className, superTitle, title, description, ...args }) => (
    <Heading className={className} {...args}>
      {superTitle ? <Heading.SuperTitle>{superTitle}</Heading.SuperTitle> : null}
      {title ? <Heading.Title>{title}</Heading.Title> : null}
      {description ? <Heading.Description>{description}</Heading.Description> : null}
    </Heading>
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
