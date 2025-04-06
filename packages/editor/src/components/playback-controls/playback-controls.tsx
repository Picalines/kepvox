import { Button } from '@repo/ui-kit/components/button'
import { PauseIcon, PlayIcon, SquareIcon } from '@repo/ui-kit/icons'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

export const PlaybackControls: FC = () => {
  const { isPlaying, start, stop, setPlayhead } = useUnit({
    isPlaying: editorModel.$isPlaying,
    start: editorModel.playbackStarted,
    stop: editorModel.playbackStopped,
    setPlayhead: editorModel.playheadSet,
  })

  const onPlayClick = () => {
    if (isPlaying) {
      stop()
    } else {
      start()
    }
  }

  const onStopClick = () => {
    stop()
    setPlayhead({ progress: 0 })
  }

  return (
    <div className="w-fit overflow-hidden rounded-lg border-2 bg-background">
      <Button onClick={onPlayClick} size="lg" variant="ghost">
        {isPlaying ? <PauseIcon className="text-blue-500" /> : <PlayIcon className="text-green-500" />}
      </Button>
      <Button onClick={onStopClick} size="lg" variant="ghost">
        <SquareIcon className="text-red-500" />
      </Button>
    </div>
  )
}
