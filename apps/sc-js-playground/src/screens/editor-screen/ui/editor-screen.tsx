'use client'

import type { FC } from 'react'

import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import { LoaderIcon, PlayIcon } from '@repo/ui-kit/icons'
import { useUnit } from 'effector-react'

import * as model from '../model'

export const EditorScreen: FC = () => {
  const { isConnecting, startConnection } = useUnit({
    isConnecting: model.$isConnecting,
    startConnection: model.connectionStarted,
  })

  return (
    <div className="p-2">
      <Text className="block">Welcome to sc-js-playground!</Text>
      <Button size="md" shape="square" className="relative" onClick={startConnection}>
        {isConnecting ? <LoaderIcon className="absolute animate-spin" /> : <PlayIcon className="absolute" />}
      </Button>
    </div>
  )
}
