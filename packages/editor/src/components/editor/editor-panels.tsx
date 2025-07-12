import { Loader } from '@repo/ui-kit/components/loader'
import { Resizable } from '@repo/ui-kit/components/resizable'
import { useUnit } from 'effector-react'
import type { FC, ReactNode } from 'react'
import { MusicSheetTile } from '#components/music-sheet-tile'
import { NodeTile } from '#components/node-tile'
import { SynthTreeTile } from '#components/synth-tree-tile'
import { editorModel } from '#model'

export const EditorPanels: FC = () => {
  return (
    <Resizable.Group direction="vertical">
      <Resizable.Panel defaultSize={50}>
        <LoaderFallback>
          <MusicSheetTile />
        </LoaderFallback>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={50}>
        <Resizable.Group direction="horizontal">
          <Resizable.Panel defaultSize={25}>
            <LoaderFallback>
              <NodeTile />
            </LoaderFallback>
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel defaultSize={75}>
            <LoaderFallback>
              <SynthTreeTile />
            </LoaderFallback>
          </Resizable.Panel>
        </Resizable.Group>
      </Resizable.Panel>
    </Resizable.Group>
  )
}

type LoaderFallbackProps = {
  children: ReactNode
}

const LoaderFallback: FC<LoaderFallbackProps> = props => {
  const { children } = props

  const { isLoaded } = useUnit({ isLoaded: editorModel.$isLoaded })

  if (!isLoaded) {
    return <Loader centered />
  }

  return children
}
