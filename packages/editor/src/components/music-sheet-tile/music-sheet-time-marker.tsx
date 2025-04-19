import { SynthTime } from '@repo/synth'
import { cn } from '@repo/ui-kit/classnames'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'
import type { MusicSheetDimensions } from './music-sheet-dimensions'

type Props = {
  dimensions: MusicSheetDimensions
  time: SynthTime
  className?: string
}

export const MusicSheetTimeMarker: FC<Props> = props => {
  const { dimensions, time, className } = props

  const { position } = useUnit({ position: editorModel.$sheetPosition })

  return (
    <div
      className={cn(
        '-translate-x-1/2 pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 bg-accent transition-colors',
        className,
      )}
      style={{ left: position.x + time.toNotes() * dimensions.note.width(SynthTime.note) }}
    />
  )
}
