import { Button } from '@repo/ui-kit/components/button'
import { PauseIcon, PlayIcon, SquareIcon } from '@repo/ui-kit/icons'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

export const PlaybackControls: FC = () => {
  const { isPlaying, toggle, stop } = useUnit({
    isPlaying: editorModel.$isPlaying,
    stop: editorModel.userStoppedPlayback,
    toggle: editorModel.userToggledPlayback,
  })

  return (
    <div className="w-fit overflow-hidden rounded-md border bg-background">
      <Button onClick={toggle} size="md" variant="ghost" className="rounded-none">
        {isPlaying ? <PauseIcon className="text-blue-500" /> : <PlayIcon className="text-green-500" />}
      </Button>
      <Button onClick={stop} size="md" variant="ghost" className="rounded-none">
        <SquareIcon className="text-red-500" />
      </Button>
    </div>
  )
}
