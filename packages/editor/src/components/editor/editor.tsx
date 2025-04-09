'use client'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { fork } from 'effector'
import { Provider } from 'effector-react'
import { type FC, memo, useMemo } from 'react'
import { AudioPermissionDialog } from '#components/audio-permission-dialog'
import { LoadingIndicator } from '#components/loading-indicator'
import { PlaybackControls } from '#components/playback-controls'
import { type Project, editorModel } from '#model'
import { EditorPanels } from './editor-panels'
import { useEditorScope } from './editor-scope'

type Props = {
  initialProject: Project
  loading?: boolean
  serializationTimeout?: number
  onSerialized?: (project: Project) => void
}

export const Editor: FC<Props> = props => {
  const { initialProject, loading = false, serializationTimeout = 1_000, onSerialized } = props

  const parentScope = useEditorScope()
  const scope = useMemo(() => parentScope ?? fork(), [parentScope])

  return (
    <Provider value={scope}>
      <editorModel.Gate
        initialProject={initialProject}
        externalLoading={loading}
        serializationTimeout={serializationTimeout}
        onSerialized={onSerialized}
      />
      <EditorUI />
    </Provider>
  )
}

const EditorUI = memo(() => (
  <Tooltip.Provider>
    <div className="relative size-full">
      <LoadingIndicator />
      <AudioPermissionDialog />
      <EditorPanels />
      <div className="-translate-x-1/2 absolute bottom-4 left-1/2">
        <PlaybackControls />
      </div>
    </div>
  </Tooltip.Provider>
))
