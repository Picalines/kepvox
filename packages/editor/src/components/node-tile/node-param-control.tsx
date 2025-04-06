import { Select } from '@repo/ui-kit/components/select'
import { Slider } from '@repo/ui-kit/components/slider'
import { useStoreMap, useUnit } from 'effector-react'
import { type FC, useCallback } from 'react'
import { type NodeId, editorModel } from '#model'

type Props = {
  nodeId: NodeId
  name: string
}

export const NodeParamControl: FC<Props> = props => {
  const { nodeId, name } = props

  const { dispatch } = useUnit({
    dispatch: editorModel.actionDispatched,
  })

  const param = useStoreMap({
    store: editorModel.$nodeParams,
    fn: params => params?.find(param => param.name === name),
    keys: [name],
  })

  const onValueChange = useCallback(
    (value: number | string) => {
      if (nodeId) {
        dispatch({ action: 'synth-node-param-set', id: nodeId, param: name, value })
      }
    },
    [nodeId, dispatch, name],
  )

  if (!param) {
    return null
  }

  if (param.type === 'number') {
    return (
      <Slider.Root
        key={nodeId}
        defaultValue={param.value}
        min={param.min}
        max={param.max}
        step={0.01}
        onChange={onValueChange}
      >
        <Slider.Label>{name}</Slider.Label>
      </Slider.Root>
    )
  }

  if (param.type === 'select') {
    return (
      <Select.Root key={nodeId} defaultValue={param.value} onValueChange={onValueChange}>
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            <Select.Header>{name}</Select.Header>
            {param.variants.map(variant => (
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
