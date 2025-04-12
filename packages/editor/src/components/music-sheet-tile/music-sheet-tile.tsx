import { Resizable } from '@repo/ui-kit/components/resizable'
import { ReactFlowProvider } from '@xyflow/react'
import type { FC } from 'react'
import { musicSheetDimensions } from './music-sheet-dimensions'
import { MusicSheetFlow } from './music-sheet-flow'
import { MusicSheetPianoRoll } from './music-sheet-piano-roll'

const DIMENSIONS = musicSheetDimensions({
  wholeNoteWidthPx: 250,
  halfStepHeightPx: 24,
})

export const MusicSheetTile: FC = () => {
  return (
    <Resizable.Group direction="horizontal">
      <Resizable.Panel defaultSize={15} maxSize={30}>
        <MusicSheetPianoRoll dimensions={DIMENSIONS} />
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={85}>
        <ReactFlowProvider>
          <MusicSheetFlow dimensions={DIMENSIONS} />
        </ReactFlowProvider>
      </Resizable.Panel>
    </Resizable.Group>
  )
}
