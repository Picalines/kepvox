import type { Meta, StoryObj } from '@storybook/react'

import { cn } from '~/lib/classnames'
import { Heading } from '../heading'
import { Card, type CardProps } from './card'

type StoryArgs = CardProps & Partial<{ title: string; description: string; content: string; footer: string }>

export default {
  title: 'components/Card',
  component: Card,
  render: ({ className, title, description, content, footer, ...args }) => (
    <Card {...args} className={cn('max-w-[400px]', className)}>
      {title || description ? (
        <Card.Header>
          <Heading>
            <Heading.Title>{title}</Heading.Title>
            <Heading.Description color="secondary">{description}</Heading.Description>
          </Heading>
        </Card.Header>
      ) : null}
      {content ? <Card.Content>{content}</Card.Content> : null}
      {footer ? <Card.Footer>{footer}</Card.Footer> : null}
    </Card>
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
