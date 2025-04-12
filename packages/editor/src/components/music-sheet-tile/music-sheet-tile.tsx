import { Resizable } from '@repo/ui-kit/components/resizable'
import { ReactFlowProvider } from '@xyflow/react'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'
import { musicSheetDimensions } from './music-sheet-dimensions'
import { MusicSheetFlow } from './music-sheet-flow'
import { MusicSheetPianoRoll } from './music-sheet-piano-roll'
import { MusicSheetTimeMarker } from './music-sheet-time-marker'
import { MusicSheetTimeline } from './music-sheet-timeline'

const DIMENSIONS = musicSheetDimensions({
  wholeNoteWidthPx: 250,
  halfStepHeightPx: 24,
  timelineHeightPx: 24,
})

export const MusicSheetTile: FC = () => {
  return (
    <Resizable.Group direction="horizontal">
      <Resizable.Panel defaultSize={15} maxSize={30}>
        <div className="relative z-1 border-b bg-background" style={{ height: DIMENSIONS.timeline.height }} />
        <MusicSheetPianoRoll dimensions={DIMENSIONS} />
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={85} className="relative">
        <MusicSheetTimeline dimensions={DIMENSIONS} />
        <TimeMarkers />
        <ReactFlowProvider>
          <MusicSheetFlow dimensions={DIMENSIONS} />
        </ReactFlowProvider>
      </Resizable.Panel>
    </Resizable.Group>
  )
}

const TimeMarkers: FC = () => {
  const { isLoaded, isPlaying, playhead, endTime } = useUnit({
    isLoaded: editorModel.$isLoaded,
    isPlaying: editorModel.$isPlaying,
    playhead: editorModel.$playhead,
    endTime: editorModel.$endTime,
  })

  if (!isLoaded) {
    return null
  }

  return (
    <>
      <MusicSheetTimeMarker dimensions={DIMENSIONS} color="red" time={endTime} />
      <MusicSheetTimeMarker dimensions={DIMENSIONS} color={isPlaying ? 'green' : 'muted'} time={playhead} />
    </>
  )
}
