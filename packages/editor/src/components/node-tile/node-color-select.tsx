import { isOneOf } from '@repo/common/predicate'
import { capitalize } from '@repo/common/string'
import { cn, tw } from '@repo/ui-kit/classnames'
import { Select } from '@repo/ui-kit/components/select'
import { useStoreMap } from 'effector-react'
import { useUnit } from 'effector-react/effector-react.mjs'
import { type FC, useCallback } from 'react'
import { NODE_COLORS } from '#meta'
import { type NodeColor, editorModel } from '#model'

export const NodeColorSelect: FC = () => {
  const { selectColor, isReadonly } = useUnit({
    selectColor: editorModel.userSelectedNodeColor,
    isReadonly: editorModel.$isReadonly,
  })

  const nodeColor = useStoreMap({
    store: editorModel.$activeSynthNode,
    fn: node => node?.color ?? 'blue',
    keys: [],
  })

  const onValueChange = useCallback(
    (value: string) => {
      if (isOneOf(value, NODE_COLORS)) {
        selectColor(value as NodeColor)
      }
    },
    [selectColor],
  )

  return (
    <Select.Root value={nodeColor} onValueChange={onValueChange} disabled={isReadonly}>
      <Select.Trigger>
        <ColorDisplay color={nodeColor} />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {NODE_COLORS.map(color => (
            <Select.Item key={color} value={color}>
              <ColorDisplay color={color} /> {capitalize(color)}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}

type ColorDisplayProps = {
  color: NodeColor
}

const ColorDisplay: FC<ColorDisplayProps> = props => {
  const { color } = props

  return <span className={cn('inline-block size-[1ch] rounded-full', NODE_COLOR_CLASSNAMES[color])} />
}

const NODE_COLOR_CLASSNAMES: Record<NodeColor, string> = {
  amber: tw`bg-amber-500`,
  blue: tw`bg-blue-500`,
  cyan: tw`bg-cyan-500`,
  emerald: tw`bg-emerald-500`,
  fuchsia: tw`bg-fuchsia-500`,
  green: tw`bg-green-500`,
  indigo: tw`bg-indigo-500`,
  lime: tw`bg-lime-500`,
  orange: tw`bg-orange-500`,
  pink: tw`bg-pink-500`,
  purple: tw`bg-purple-500`,
  red: tw`bg-red-500`,
  rose: tw`bg-rose-500`,
  sky: tw`bg-sky-500`,
  teal: tw`bg-teal-500`,
  violet: tw`bg-violet-500`,
  yellow: tw`bg-yellow-500`,
  zinc: tw`bg-zinc-500`,
}
