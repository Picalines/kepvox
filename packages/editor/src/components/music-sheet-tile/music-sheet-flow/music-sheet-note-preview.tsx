import type { PitchNotation } from '@repo/synth'
import { cn } from '@repo/ui-kit/classnames'
import { Text } from '@repo/ui-kit/components/text'
import { ViewportPortal } from '@xyflow/react'
import { useUnit } from 'effector-react'
import { type CSSProperties, type FC, useRef } from 'react'
import { editorModel } from '#model'
import type { MusicSheetDimensions } from '../music-sheet-dimensions'

type Props = {
  dimensions: MusicSheetDimensions
}

export const MusicSheetNotePreview: FC<Props> = props => {
  const { dimensions } = props

  const { preview } = useUnit({ preview: editorModel.$notePreview })

  const pitch = useRef<PitchNotation>('c0')
  const positionStyles = useRef<CSSProperties>({ display: 'none' })

  if (preview) {
    pitch.current = preview.pitch
    positionStyles.current = {
      left: dimensions.note.left(preview.time),
      top: dimensions.note.top(preview.pitch),
      width: dimensions.note.width(preview.duration),
      height: dimensions.note.height,
    }
  }

  return (
    <ViewportPortal>
      <div
        className={cn(
          'zoom-in-75 zoom-out-75 fade-out relative flex items-center rounded-md border-2 border-muted-foreground border-dashed fill-mode-forwards px-2',
          preview && 'animate-in',
          !preview && 'animate-out',
        )}
        style={positionStyles.current}
      >
        <Text color="muted">{pitch.current.toUpperCase()}</Text>
      </div>
    </ViewportPortal>
  )
}
