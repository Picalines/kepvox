import { Pitch } from '@repo/synth'
import { tw } from '@repo/ui-kit/classnames'
import { ViewportPortal } from '@xyflow/react'
import { useUnit } from 'effector-react'
import { type FC, useId, useMemo } from 'react'
import { editorModel } from '#model'
import type { MusicSheetDimensions } from './music-sheet-dimensions'

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

  const keyLines = Pitch.names.toReversed().map((name, index) => ({
    index,
    className: Pitch.parseName(name).isAccidental ? tw`fill-accent` : tw`fill-background`,
  }))

  const separatorHeight = 0.05

  return (
    <svg role="graphics-symbol" width="100%" height="100%" overflow="visible" className="fill-border">
      <pattern
        id={patternId}
        viewBox="0 0 1 12"
        width="100%"
        height={dimensions.note.height * 12}
        patternUnits="userSpaceOnUse"
        preserveAspectRatio="xMinYMin meet"
      >
        {keyLines.map(({ index, className: lineClassName }) => (
          <rect
            key={index}
            x={0}
            y={index + separatorHeight / 2}
            width="100%"
            height={1 - separatorHeight}
            className={lineClassName}
            fillOpacity={0.25}
          />
        ))}
      </pattern>
      <rect fill={`url(#${patternId})`} x={0} y={0} width="100%" height="100%" />
    </svg>
  )
}
