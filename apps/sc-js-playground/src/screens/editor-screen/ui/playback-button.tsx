import { Button } from '@repo/ui-kit/components/button'
import { LoaderIcon, PlayIcon } from '@repo/ui-kit/icons'
import { useUnit } from 'effector-react'

import * as model from '../model'

export const PlaybackButton = () => {
  const { isInitializing, onClick } = useUnit({
    isInitializing: model.isScInitializing,
    onClick: model.onPlaybackRequested,
  })

  return (
    <Button size="md" shape="square" variant="secondary" className="relative" onClick={onClick}>
      {isInitializing ? <LoaderIcon className="absolute animate-spin" /> : <PlayIcon className="absolute" />}
    </Button>
  )
}
