import { Text } from '@repo/ui-kit/components/text'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { SCServerStatus, useSCServer } from '~/entities/sc-server'

const statusTexts: Record<SCServerStatus, string> = {
  [SCServerStatus.None]: 'Not connected',
  [SCServerStatus.Booting]: 'Initializing...',
  [SCServerStatus.Running]: 'Running',
}

export const SCStatus: FC = () => {
  const scServer = useSCServer()

  const { serverStatus } = useUnit({
    serverStatus: scServer.$status,
  })

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Text variant="text-xs" color="secondary">
          {statusTexts[serverStatus]}
        </Text>
      </Tooltip.Trigger>
      <Tooltip.Content>SuperCollider status</Tooltip.Content>
      <Tooltip.Arrow />
    </Tooltip>
  )
}
