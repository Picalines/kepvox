import { Pitch } from '@repo/synth'
import { ViewportPortal } from '@xyflow/react'
import { useUnit } from 'effector-react'
import { type FC, useId, useMemo } from 'react'
import { editorModel } from '#model'
import type { MusicSheetDimensions } from '../music-sheet-dimensions'

type Props = {
  dimensions: MusicSheetDimensions
}

export const MusicSheetBackground: FC<Props> = props => {
  const { dimensions } = props

  const { viewport } = useUnit({ viewport: editorModel.$sheetPosition })

  const pattern = useMemo(() => <SheetPattern dimensions={dimensions} />, [dimensions])

  return (
    <ViewportPortal>
      <div className="-z-1 absolute w-full" style={{ height: dimensions.sheet.height, right: viewport.x }}>
        {pattern}
      </div>
    </ViewportPortal>
  )
}

type PatternProps = {
  dimensions: MusicSheetDimensions
}

const SheetPattern: FC<PatternProps> = props => {
  const { dimensions } = props

  const patternId = useId()

  return (
    <svg role="graphics-symbol" width="100%" height="100%" overflow="visible">
      <pattern
        id={patternId}
        viewBox="0 0 1 12"
        width="100%"
        height={dimensions.note.height * 12}
        patternUnits="userSpaceOnUse"
        preserveAspectRatio="xMinYMin meet"
      >
        {Pitch.names.toReversed().map((name, index) => (
          <rect
            key={name}
            x={0}
            y={index}
            width="100%"
            height={1}
            className={Pitch[name].isAccidental ? 'fill-secondary/50' : 'fill-background'}
          />
        ))}
      </pattern>
      <rect fill={`url(#${patternId})`} x={0} y={0} width="100%" height="100%" />
    </svg>
  )
}
