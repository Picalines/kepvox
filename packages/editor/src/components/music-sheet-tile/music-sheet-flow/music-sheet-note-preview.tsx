import { cn } from '@repo/ui-kit/classnames'
import { Text } from '@repo/ui-kit/components/text'
import { ViewportPortal } from '@xyflow/react'
import { useUnit } from 'effector-react'
import type { CSSProperties, FC } from 'react'
import { editorModel } from '#model'
import type { MusicSheetDimensions } from '../music-sheet-dimensions'

type Props = {
  dimensions: MusicSheetDimensions
}

export const MusicSheetNotePreview: FC<Props> = props => {
  const { dimensions } = props

  const preview = useUnit(editorModel.$notePreview)

  const pitch = preview?.pitch ?? 'c0'
  const positionStyles: CSSProperties = preview
    ? {
        left: dimensions.note.left(preview.time),
        top: dimensions.note.top(preview.pitch),
        width: dimensions.note.width(preview.duration),
        height: dimensions.note.height,
      }
    : { display: 'none' }

  return (
    <ViewportPortal>
      <div
        className={cn(
          'zoom-in-75 zoom-out-75 fade-out relative flex items-center rounded-md border-2 border-muted-foreground border-dashed fill-mode-forwards px-2',
          preview && 'animate-in',
          !preview && 'animate-out',
        )}
        style={positionStyles}
      >
        <Text color="muted">{pitch.toUpperCase()}</Text>
      </div>
    </ViewportPortal>
  )
}
