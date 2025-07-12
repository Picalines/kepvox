import { capitalize } from '@repo/common/string'
import { Heading } from '@repo/ui-kit/components/heading'
import { useStoreMap } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

type Props = {}

export const NodeHeading: FC<Props> = () => {
  const nodeType = useStoreMap({
    store: editorModel.$activeSynthNode,
    fn: node => node?.type ?? '',
    keys: [],
  })

  const nodeNumber = useStoreMap({
    store: editorModel.$activeSynthNode,
    fn: node => node?.number ?? null,
    keys: [],
  })

  return (
    <Heading.Root>
      <Heading.Title>{capitalize(nodeType)}</Heading.Title>
      <Heading.Description>#{nodeNumber}</Heading.Description>
    </Heading.Root>
  )
}
