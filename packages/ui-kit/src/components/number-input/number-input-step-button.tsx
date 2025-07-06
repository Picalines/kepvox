'use client'

import type { OmitExisting } from '@repo/common/typing'
import { type ComponentProps, type FC, useRef } from 'react'

type Props = OmitExisting<ComponentProps<'button'>, 'onClick'> & {
  stepDirection: 'up' | 'down'
  onValueChange?: (value: number) => void
}

export const NumberInputStepButton: FC<Props> = props => {
  const { stepDirection, onValueChange, ...buttonProps } = props

  const buttonRef = useRef<HTMLButtonElement>(null)

  const onMouseDown = () => {
    const button = buttonRef.current
    const input = button?.parentElement?.querySelector('input')
    if (!button || !input) {
      return
    }

    if (stepDirection === 'up') {
      input.stepUp()
    } else {
      input.stepDown()
    }

    onValueChange?.(input.valueAsNumber)
  }

  return <button {...buttonProps} ref={buttonRef} onMouseDown={onMouseDown} />
}
