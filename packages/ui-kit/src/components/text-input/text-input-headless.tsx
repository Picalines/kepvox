import type { OmitExisting } from '@repo/common/typing'
import type { ChangeEventHandler, ComponentProps, FC } from 'react'

type Props = OmitExisting<ComponentProps<'input'>, 'type' | 'onChange'> & {
  type?: 'text' | 'password'
  onValueChange?: (value: string) => void
}

export const TextInputHeadless: FC<Props> = props => {
  const { onValueChange, ...inputProps } = props

  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    onValueChange?.(event.target.value)
  }

  return <input {...inputProps} onChange={onChange} />
}
