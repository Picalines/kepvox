import { Resizable } from '@repo/ui-kit/components/resizable'
import { Text } from '@repo/ui-kit/components/text'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import type { FC } from 'react'
import { NodesTile } from '#components/nodes-tile'

export const Editor: FC = () => {
  return (
    <Tooltip.Provider>
      <Resizable.Group direction="horizontal" className="h-full w-full">
        <Resizable.Panel>
          <Text>timeline</Text>
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>
          <Resizable.Group direction="vertical">
            <Resizable.Panel>
              <NodesTile />
            </Resizable.Panel>
            <Resizable.Handle />
            <Resizable.Panel>
              <Text>parameters</Text>
            </Resizable.Panel>
          </Resizable.Group>
        </Resizable.Panel>
      </Resizable.Group>
    </Tooltip.Provider>
  )
}
