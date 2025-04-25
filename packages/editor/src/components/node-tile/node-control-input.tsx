import { NumberInput } from '@repo/ui-kit/components/number-input'
import { Select } from '@repo/ui-kit/components/select'
import { Slider } from '@repo/ui-kit/components/slider'
import { useUnit } from 'effector-react'
import { type FC, useCallback } from 'react'
import { type NodeControl, type NodeId, editorModel } from '#model'

type Props = {
  nodeId: NodeId
  control: NodeControl
}

export const NodeControlInput: FC<Props> = props => {
  const { nodeId, control } = props

  const { requestActions, isReadonly } = useUnit({
    requestActions: editorModel.userRequestedActions,
    isReadonly: editorModel.$isReadonly,
  })

  const onValueChange = useCallback(
    (value: number | string) => {
      if (nodeId && !Number.isNaN(value)) {
        requestActions([{ action: 'synth-node-param-set', id: nodeId, param: control.name, value }])
      }
    },
    [nodeId, requestActions, control],
  )

  if (control.type === 'number') {
    return (
      <NumberInput.Root
        key={nodeId}
        value={control.value}
        step={control.step}
        onValueChange={onValueChange}
        disabled={isReadonly}
      >
        <NumberInput.Label>
          {control.name} ({control.unit})
        </NumberInput.Label>
      </NumberInput.Root>
    )
  }

  if (control.type === 'slider') {
    return (
      <Slider.Root
        key={nodeId}
        value={control.value}
        min={control.min}
        max={control.max}
        step={control.step}
        onValueChange={onValueChange}
        disabled={isReadonly}
      >
        <Slider.Label>{control.name}</Slider.Label>
      </Slider.Root>
    )
  }

  if (control.type === 'select') {
    return (
      <Select.Root key={nodeId} value={control.value} onValueChange={onValueChange} disabled={isReadonly}>
        <Select.Trigger />
        <Select.Label>{control.name}</Select.Label>
        <Select.Content>
          <Select.Group>
            {control.variants.map(variant => (
              <Select.Item key={variant} value={variant}>
                {variant}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    )
  }

  return null
}
