import { ScrollArea } from '@repo/ui-kit/components/scroll-area'
import { Text } from '@repo/ui-kit/components/text'
import { MousePointerClickIcon, XIcon } from '@repo/ui-kit/icons'
import { useUnit } from 'effector-react'
import type { ComponentType, FC } from 'react'
import { editorModel } from '#model'
import { NodeParamControl } from './node-param-control'

export const NodeTile: FC = () => {
  const { nodeId, params } = useUnit({ nodeId: editorModel.$activeNodeId, params: editorModel.$nodeParams })

  if (!nodeId || !params) {
    return <Stub Icon={MousePointerClickIcon}>select node</Stub>
  }

  if (!params.length) {
    return <Stub Icon={XIcon}>no parameters</Stub>
  }

  return (
    <ScrollArea.Root className="bg-background">
      <ScrollArea.Bar orientation="vertical" />
      <ScrollArea.Content>
        <div className="@container p-2">
          <div className="grid @md:grid-cols-2 grid-cols-1 gap-2">
            {params.map(({ name }) => (
              <NodeParamControl key={name} nodeId={nodeId} name={name} />
            ))}
          </div>
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
