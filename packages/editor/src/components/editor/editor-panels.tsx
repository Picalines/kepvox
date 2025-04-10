import { Resizable } from '@repo/ui-kit/components/resizable'
import type { FC } from 'react'
import { MusicSheetTile } from '#components/music-sheet-tile'
import { NodeTile } from '#components/node-tile'
import { SynthTreeTile } from '#components/synth-tree-tile'

export const EditorPanels: FC = () => {
  return (
    <Resizable.Group direction="vertical" className="h-full w-full">
      <Resizable.Panel defaultSize={50}>
        <MusicSheetTile />
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={50}>
        <Resizable.Group direction="horizontal">
          <Resizable.Panel defaultSize={25}>
            <NodeTile />
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel defaultSize={75} className="relative">
            <SynthTreeTile />
          </Resizable.Panel>
        </Resizable.Group>
      </Resizable.Panel>
    </Resizable.Group>
  )
}
