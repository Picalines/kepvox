import { ScrollArea } from '@repo/ui-kit/components/scroll-area'
import { Text } from '@repo/ui-kit/components/text'
import { MousePointerClickIcon, XIcon } from '@repo/ui-kit/icons'
import { useList, useUnit } from 'effector-react'
import type { ComponentType, FC } from 'react'
import { editorModel } from '#model'
import { NodeParamControl } from './node-param-control'

export const NodeTile: FC = () => {
  const { nodeId } = useUnit({ nodeId: editorModel.$activeNodeId })

  const controls = useList(editorModel.$nodeControls, {
    fn: control => nodeId && <NodeParamControl nodeId={nodeId} name={control.name} />,
    keys: [nodeId],
    placeholder: null,
  })

  if (!nodeId) {
    return <Stub Icon={MousePointerClickIcon}>select node</Stub>
  }

  if (controls === null) {
    return <Stub Icon={XIcon}>no parameters</Stub>
  }

  return (
    <ScrollArea.Root className="bg-background">
      <ScrollArea.Bar orientation="vertical" />
      <ScrollArea.Content>
        <div className="@container p-3">
          <div className="grid @md:grid-cols-2 grid-cols-1 gap-3">{controls}</div>
        </div>
      </ScrollArea.Content>
    </ScrollArea.Root>
  )
}

type StubProps = {
  Icon: ComponentType
  children: string
}

const Stub: FC<StubProps> = props => {
  const { Icon, children } = props

  return (
    <div className="relative size-full bg-background">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 text-nowrap">
        <Text color="muted" className="flex flex-col items-center">
          <Icon />
          {children}
        </Text>
      </div>
    </div>
  )
}
