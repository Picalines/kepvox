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
      <Button.Root onClick={toggle} size="md" variant="ghost" className="rounded-none">
        {isPlaying ? (
          <Button.Icon icon={PauseIcon} className="text-blue-500" />
        ) : (
          <Button.Icon icon={PlayIcon} className="text-green-500" />
        )}
      </Button.Root>
      <Button.Root onClick={stop} size="md" variant="ghost" className="rounded-none">
        <Button.Icon icon={SquareIcon} className="text-red-500" />
      </Button.Root>
    </div>
  )
}
