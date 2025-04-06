import { ScrollArea } from '@repo/ui-kit/components/scroll-area'
import { Text } from '@repo/ui-kit/components/text'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

export const NodeTile: FC = () => {
  const { params } = useUnit({ params: editorModel.$nodeParams })

  return (
    <ScrollArea.Root>
      <ScrollArea.Bar orientation="vertical" />
      <ScrollArea.Content>
        <Text>
          <pre>{JSON.stringify(params, null, 2)}</pre>
        </Text>
      </ScrollArea.Content>
    </ScrollArea.Root>
  )
}
