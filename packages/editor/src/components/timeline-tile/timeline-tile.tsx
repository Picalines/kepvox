import { Text } from '@repo/ui-kit/components/text'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

// TODO: #101

export const TimelineTile: FC = () => {
  const { isPlaying, progress } = useUnit({
    isPlaying: editorModel.$isPlaying,
    progress: editorModel.$playbackProgress,
  })

  return <Text>timeline {isPlaying ? <>{Math.round(progress * 100)}%</> : null}</Text>
}
