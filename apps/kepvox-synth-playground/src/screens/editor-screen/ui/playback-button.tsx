import { Button } from '@repo/ui-kit/components/button'
import { PlayIcon } from '@repo/ui-kit/icons'

export const PlaybackButton = () => {
  return (
    <Button size="md" shape="square" variant="secondary" className="relative">
      <PlayIcon className="absolute" />
    </Button>
  )
}
