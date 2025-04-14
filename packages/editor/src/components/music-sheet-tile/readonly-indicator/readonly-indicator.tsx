import { Text } from '@repo/ui-kit/components/text'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

export const ReadonlyIndicator: FC = () => {
  const { isReadonly } = useUnit({ isReadonly: editorModel.$isReadonly })

  if (!isReadonly) {
    return null
  }

  return (
    <Text color="accent" weight="medium" className="pointer-events-none select-none rounded-md bg-accent p-1">
      non-editable
    </Text>
  )
}
