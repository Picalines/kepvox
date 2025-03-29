import { Resizable } from '@repo/ui-kit/components/resizable'
import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { NodesTile } from '#components/nodes-tile'

export const EditorPanels: FC = () => {
  return (
    <Resizable.Group direction="horizontal" className="h-full w-full">
      <Resizable.Panel>
        <Text>timeline</Text>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel>
        <Resizable.Group direction="vertical">
          <Resizable.Panel className="relative">
            <NodesTile />
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel>
            <Text>parameters</Text>
          </Resizable.Panel>
        </Resizable.Group>
      </Resizable.Panel>
    </Resizable.Group>
  )
}
