import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'

export const Editor: FC = () => {
  return (
    <Button>
      <Text color="positive">@repo/editor configured!</Text>
    </Button>
  )
}
