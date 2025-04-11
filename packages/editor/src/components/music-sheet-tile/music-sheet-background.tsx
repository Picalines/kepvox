import { Pitch } from '@repo/synth'
import { tw } from '@repo/ui-kit/classnames'
import { ViewportPortal } from '@xyflow/react'
import { type FC, memo, useId } from 'react'
import type { MusicSheetDimensions } from './music-sheet-dimensions'

type Props = {
  dimensions: MusicSheetDimensions
}

const MusicSheetBackgroundImpl: FC<Props> = props => {
  const { dimensions } = props

  const patternId = useId()

  const accidentalKeys = Pitch.names.flatMap((name, index) => (name.includes('#') ? [index] : []))

  const keyLines = Array.from({ length: 12 }).map((_, index) => ({
    index,
    className: accidentalKeys.includes(index) ? tw`fill-accent` : tw`fill-background`,
  }))

  const separatorHeight = 0.05

  return (
    <ViewportPortal>
      <div className="-z-1 absolute right-0 left-0" style={{ height: dimensions.sheet.height }}>
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
      </div>
    </ViewportPortal>
  )
}

export const MusicSheetBackground = memo(MusicSheetBackgroundImpl)
