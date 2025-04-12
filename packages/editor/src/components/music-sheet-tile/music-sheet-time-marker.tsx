import { SynthTime } from '@repo/synth'
import { cn, tw } from '@repo/ui-kit/classnames'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'
import type { MusicSheetDimensions } from './music-sheet-dimensions'

type MarkerColor = 'green' | 'red' | 'muted'

type Props = {
  dimensions: MusicSheetDimensions
  color: MarkerColor
  time: SynthTime
}

export const MusicSheetTimeMarker: FC<Props> = props => {
  const { dimensions, color, time } = props

  const { position } = useUnit({ position: editorModel.$sheetPosition })

  return (
    <div
      className={cn(
        '-translate-x-1/2 pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 opacity-75 transition-colors',
        MARKER_COLOR_CLASSNAMES[color],
      )}
      style={{ left: position.x + time.toNotes() * dimensions.note.width(SynthTime.note) }}
    />
  )
}

const MARKER_COLOR_CLASSNAMES: Record<MarkerColor, string> = {
  green: tw`bg-emerald-500`,
  red: tw`bg-rose-500`,
  muted: tw`bg-muted`,
}
