import type { Meta, StoryObj } from '@storybook/react'

import { cn } from '#lib/classnames'
import { Card } from '.'
import { Heading } from '../heading'

type StoryArgs = Card.RootProps & Partial<{ title: string; description: string; content: string; footer: string }>

export default {
  title: 'components/Card',
  component: Card.Root,
  render: ({ className, title, description, content, footer, ...args }) => (
    <Card.Root {...args} className={cn('max-w-[400px]', className)}>
      {title || description ? (
        <Card.Header>
          <Heading.Root>
            <Heading.Title>{title}</Heading.Title>
            <Heading.Description color="secondary">{description}</Heading.Description>
          </Heading.Root>
        </Card.Header>
      ) : null}
      {content ? <Card.Content>{content}</Card.Content> : null}
      {footer ? <Card.Footer>{footer}</Card.Footer> : null}
    </Card.Root>
  ),
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    content: 'Content',
    footer: 'Footer',
  },
}
