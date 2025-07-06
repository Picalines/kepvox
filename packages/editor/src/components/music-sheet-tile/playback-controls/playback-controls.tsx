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
      <Button.Root
        eager
        action={toggle}
        size="md"
        variant="ghost"
        feedback={isPlaying ? 'modified' : 'positive'}
        className="rounded-none"
      >
        <Button.Icon icon={isPlaying ? PauseIcon : PlayIcon} />
      </Button.Root>
      <Button.Root eager action={stop} size="md" variant="ghost" feedback="negative" className="rounded-none">
        <Button.Icon icon={SquareIcon} />
      </Button.Root>
    </div>
  )
}
