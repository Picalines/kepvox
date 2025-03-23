import { Resizable } from '@repo/ui-kit/components/resizable'
import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'

export const Editor: FC = () => {
  return (
    <Resizable.Group direction="horizontal" className="h-full w-full">
      <Resizable.Panel>
        <Text>timeline</Text>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel>
        <Resizable.Group direction="vertical">
          <Resizable.Panel>
            <Text>nodes</Text>
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
