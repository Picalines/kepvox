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
import { PlaybackControls } from './playback-controls'
import { ReadonlyIndicator } from './readonly-indicator'
import { TempoControls } from './tempo-controls'

const DIMENSIONS = musicSheetDimensions({
  wholeNoteWidthPx: 250,
  halfStepHeightPx: 24,
  timelineHeightPx: 24,
})

export const MusicSheetTile: FC = () => {
  return (
    <div className="relative h-full bg-background">
      <Resizable.Group direction="horizontal">
        <Resizable.Panel defaultSize={15} maxSize={30}>
          <div className="relative z-1 border-b bg-background" style={{ height: DIMENSIONS.timeline.height }} />
          <MusicSheetPianoRoll dimensions={DIMENSIONS} />
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={85}>
          <MusicSheetTimeline dimensions={DIMENSIONS} />
          <TimeMarkers />
          <ReactFlowProvider>
            <MusicSheetFlow dimensions={DIMENSIONS} />
          </ReactFlowProvider>
        </Resizable.Panel>
      </Resizable.Group>
      <div className="absolute right-2 bottom-2 z-20 flex justify-end gap-2">
        <TempoControls />
        <PlaybackControls />
      </div>
      <div className="absolute top-1 right-1 z-20">
        <ReadonlyIndicator />
      </div>
    </div>
  )
}

const TimeMarkers: FC = () => {
  const { isPlaying, playhead, endTime } = useUnit({
    isPlaying: editorModel.$isPlaying,
    playhead: editorModel.$playhead,
    endTime: editorModel.$endTime,
  })

  return (
    <>
      <MusicSheetTimeMarker dimensions={DIMENSIONS} time={endTime} className="bg-destructive" />
      <MusicSheetTimeMarker dimensions={DIMENSIONS} time={playhead} className={isPlaying ? 'bg-primary' : 'bg-muted'} />
    </>
  )
}
