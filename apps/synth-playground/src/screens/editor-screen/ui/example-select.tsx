'use client'

import { Select } from '@repo/ui-kit/components/select'
import { useUnit } from 'effector-react'
import { type FC, useCallback } from 'react'
import { EXAMPLES, model } from '../model'

export const ExampleSelect: FC = () => {
  const { example, onChange, disabled } = useUnit({
    example: model.$example,
    onChange: model.exampleSelected,
    disabled: model.$isReadonly,
  })

  const onValueChange = useCallback(
    (value: string) => {
      if (isExampleName(value)) {
        onChange(value)
      }
    },
    [onChange],
  )

  return (
    <Select.Root size="lg" value={example.name} onValueChange={onValueChange} disabled={disabled}>
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          <Select.Header>Examples</Select.Header>
          {Object.keys(EXAMPLES).map(example => (
            <Select.Item key={example} value={example}>
              {example}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}

const isExampleName = (str: string): str is keyof typeof EXAMPLES => str in EXAMPLES
