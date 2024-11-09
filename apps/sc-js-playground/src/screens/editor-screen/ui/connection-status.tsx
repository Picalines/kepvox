import { Text } from '@repo/ui-kit/components/text'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { ScClientStatus, useScClient } from '~/entities/sc-client'
import { ScServerStatus, useScServer } from '~/entities/sc-server'

import * as model from '../model'

const serverStatusTexts: Record<ScServerStatus, string> = {
  [ScServerStatus.Offline]: 'Server offline',
  [ScServerStatus.Booting]: 'Initializing...',
  [ScServerStatus.Running]: 'Server running',
}

const clientStatusTexts: Partial<Record<ScClientStatus, string>> = {
  [ScClientStatus.Connecting]: 'Connecting...',
  [ScClientStatus.Connected]: 'Running',
}

export const ConnectionStatus: FC = () => {
  const scServer = useScServer()
  const scClient = useScClient()

  const { serverStatus, clientStatus, isInitializing, isRunning } = useUnit({
    serverStatus: scServer.$status,
    clientStatus: scClient.$status,
    isInitializing: model.isScInitializing,
    isRunning: model.isScRunning,
  })

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Text variant="text-xs" color={isRunning ? 'positive' : isInitializing ? 'primary' : 'secondary'}>
          {clientStatusTexts[clientStatus] ?? serverStatusTexts[serverStatus]}
        </Text>
      </Tooltip.Trigger>
      <Tooltip.Content>SuperCollider status</Tooltip.Content>
      <Tooltip.Arrow />
    </Tooltip>
  )
}
