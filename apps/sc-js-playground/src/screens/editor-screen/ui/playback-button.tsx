import { Button } from '@repo/ui-kit/components/button'
import { LoaderIcon, PlayIcon } from '@repo/ui-kit/icons'
import { useUnit } from 'effector-react'
import { useCallback } from 'react'
import { SCServerStatus, useSCServer } from '~/entities/sc-server'

const SUPER_COLLIDER_PORT = 57110

export const PlaybackButton = () => {
  const scServer = useSCServer()

  const { serverStatus, bootServer } = useUnit({
    serverStatus: scServer.$status,
    bootServer: scServer.bootInitiated,
  })

  const onClick = useCallback(() => {
    bootServer({ port: SUPER_COLLIDER_PORT, numberOfOutputs: 2, numberOfInputs: 0 })
  }, [bootServer])

  return (
    <Button size="md" shape="square" variant="secondary" className="relative" onClick={onClick}>
      {serverStatus === SCServerStatus.Booting ? (
        <LoaderIcon className="absolute animate-spin" />
      ) : (
        <PlayIcon className="absolute" />
      )}
    </Button>
  )
}
