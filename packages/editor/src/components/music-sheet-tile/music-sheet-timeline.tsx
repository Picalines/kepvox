import { Notes, Range, SynthTime } from '@repo/synth'
import { useUnit } from 'effector-react'
import { type FC, type MouseEventHandler, useCallback, useId, useMemo, useRef } from 'react'
import { editorModel } from '#model'
import type { MusicSheetDimensions } from './music-sheet-dimensions'

type Props = {
  dimensions: MusicSheetDimensions
}

const NOTE_DIVISIONS = 8

export const MusicSheetTimeline: FC<Props> = props => {
  const { dimensions } = props

  const { position, requestActions } = useUnit({
    position: editorModel.$sheetPosition,
    requestActions: editorModel.userRequestedActions,
  })

  const containerRef = useRef<SVGSVGElement>(null)

  const wholeNoteWidth = dimensions.note.width(SynthTime.note)

  const onClick = useCallback<MouseEventHandler>(
    event => {
      const container = containerRef.current
      if (!container) {
        return
      }

      const time = SynthTime.fromNotes(
        Notes.orClamp(
          Range.positive.clamp(event.clientX - container.getBoundingClientRect().left - position.x) / wholeNoteWidth,
        ),
      )

      requestActions([{ action: 'ending-note-set', time }])
    },
    [position, wholeNoteWidth, requestActions],
  )

  const divisionMarks = useMemo(
    () =>
      Array.from({ length: NOTE_DIVISIONS }).map((_, i) => (
        <rect
          key={String(i)}
          x={(-wholeNoteWidth / NOTE_DIVISIONS) * i}
          y={0}
          width={1}
          height={1}
          className={i === 0 ? 'fill-primary' : 'fill-accent'}
        />
      )),
    [wholeNoteWidth],
  )

  const patternId = useId()

  return (
    <div className="relative overflow-hidden border-b" style={{ height: dimensions.timeline.height }}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: not planned */}
      <svg role="graphics-symbol" width="100%" height="100%" overflow="visible" ref={containerRef} onClick={onClick}>
        <pattern
          id={patternId}
          viewBox="0 0 1 1"
          width={wholeNoteWidth}
          x={position.x}
          height={1}
          patternUnits="userSpaceOnUse"
          preserveAspectRatio="xMaxYMin meet"
        >
          {divisionMarks}
        </pattern>
        <rect x={0} y={0} width="100%" height="100%" className="fill-background" />
        <rect fill={`url(#${patternId})`} x={0} y={0} width="100%" height="100%" />
      </svg>
    </div>
  )
}
