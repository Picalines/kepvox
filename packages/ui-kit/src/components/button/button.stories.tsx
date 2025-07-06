import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { PlayIcon } from '#icons'
import { Button } from '.'

// See https://github.com/joe-bell/cva/pull/333
const variants = ['primary', 'secondary', 'outline', 'ghost'] satisfies Button.RootProps['variant'][]
const sizes = ['sm', 'md', 'lg'] satisfies Button.RootProps['size'][]
const feedbacks = ['none', 'positive', 'negative', 'modified'] satisfies Button.RootProps['feedback'][]

type StoryArgs = Button.RootProps

export default {
  title: 'inputs/Button',
  component: Button.Root,
  args: {
    action: fn(),
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Variants: Story = {
  render: buttonArgs => (
    <div className="grid w-fit grid-cols-4 gap-2">
      {variants.map(variant =>
        feedbacks.map(feedback => (
          <Button.Root key={variant} {...buttonArgs} variant={variant} feedback={feedback}>
            <Button.Text>Button</Button.Text>
          </Button.Root>
        )),
      )}
    </div>
  ),
}

export const Disabled: Story = {
  ...Variants,
  args: {
    ...Variants.args,
    disabled: true,
  },
}

export const Sizes: Story = {
  render: buttonArgs => (
    <>
      {sizes.map(size => (
        <div key={size} className="mb-2">
          <Button.Root {...buttonArgs} size={size}>
            <Button.Text>{size}</Button.Text>
          </Button.Root>
        </div>
      ))}
    </>
  ),
}

export const Icon: Story = {
  render: buttonArgs => (
    <div className="grid w-fit grid-cols-3 gap-2">
      {sizes.map(size =>
        (
          [
            ['end', 'Play'],
            ['start', 'Play'],
            [undefined, ''],
          ] as const
        ).map(([position, text]) => (
          <Button.Root key={size + position + text} {...buttonArgs} size={size}>
            <Button.Icon icon={PlayIcon} position={position} />
            <Button.Text>{text}</Button.Text>
          </Button.Root>
        )),
      )}
    </div>
  ),
}
