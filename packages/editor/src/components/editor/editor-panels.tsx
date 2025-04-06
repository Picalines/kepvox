import { Resizable } from '@repo/ui-kit/components/resizable'
import type { FC } from 'react'
import { NodeTile } from '#components/node-tile'
import { NodesTile } from '#components/nodes-tile'
import { TimelineTile } from '#components/timeline-tile'

export const EditorPanels: FC = () => {
  return (
    <Resizable.Group direction="vertical" className="h-full w-full">
      <Resizable.Panel defaultSize={50}>
        <TimelineTile />
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={50}>
        <Resizable.Group direction="horizontal">
          <Resizable.Panel defaultSize={25}>
            <NodeTile />
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel defaultSize={75} className="relative">
            <NodesTile />
          </Resizable.Panel>
        </Resizable.Group>
      </Resizable.Panel>
    </Resizable.Group>
  )
}
