import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { PlayIcon } from '#icons'
import { Button } from '.'

// See https://github.com/joe-bell/cva/pull/333
const buttonVariants = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
] satisfies Button.RootProps['variant'][]

const buttonSizes = ['sm', 'md', 'lg'] satisfies Button.RootProps['size'][]

type StoryArgs = Button.RootProps

export default {
  title: 'components/Button',
  component: Button.Root,
  args: {
    onClick: fn(),
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Variants: Story = {
  render: buttonArgs => (
    <>
      {buttonVariants.map(variant => (
        <div key={variant} className="mb-2">
          <Button.Root {...buttonArgs} variant={variant}>
            <Button.Text>{variant}</Button.Text>
          </Button.Root>
        </div>
      ))}
    </>
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
      {buttonSizes.map(size => (
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
      {buttonSizes.map(size =>
        (
          [
            ['end', true],
            ['start', true],
            [undefined, false],
          ] as const
        ).map(([position, hasText]) => (
          <Button.Root key={size + position + hasText} {...buttonArgs} size={size}>
            <Button.Icon icon={PlayIcon} position={position} />
            {hasText && <Button.Text>Play</Button.Text>}
          </Button.Root>
        )),
      )}
    </div>
  ),
}
