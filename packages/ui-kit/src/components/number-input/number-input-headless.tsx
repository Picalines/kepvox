'use client'

import type { OmitExisting } from '@repo/common/typing'
import type { ChangeEventHandler, ComponentProps, FC } from 'react'

type Props = OmitExisting<ComponentProps<'input'>, 'type' | 'onChange'> & {
  onValueChange?: (value: number) => void
}

export const NumberInputHeadless: FC<Props> = props => {
  const { onValueChange, ...inputProps } = props

  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    const value = event.target.valueAsNumber
    onValueChange?.(value)
  }

  return <input {...inputProps} type="number" onChange={onChange} />
}
