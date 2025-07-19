import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'

export const EditorMenubar: FC = () => {
  return (
    <div className="flex border-b-2 p-2">
      <Text color="muted">@kepvox/editor</Text>
    </div>
  )
}
