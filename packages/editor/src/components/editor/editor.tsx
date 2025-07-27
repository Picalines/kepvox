'use client'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { fork } from 'effector'
import { Provider } from 'effector-react'
import { type FC, memo, useMemo } from 'react'
import { LoadingIndicator } from '#components/loading-indicator'
import { NodeCreationDialog } from '#components/node-creation-dialog'
import { type Project, editorModel } from '#model'
import { EditorPanels } from './editor-panels'
import { useEditorScope } from './editor-scope'

import '@xyflow/react/dist/style.css'

type Props = {
  initialProject: Project
  readonly?: boolean
  loading?: boolean
  serializationTimeout?: number
  onSerialized?: (project: Project) => void
  onPlayingChange?: (isPlaying: boolean) => void
}

export const Editor: FC<Props> = props => {
  const {
    initialProject,
    readonly = false,
    loading = false,
    serializationTimeout = 1_000,
    onSerialized,
    onPlayingChange,
  } = props

  const parentScope = useEditorScope()
  const scope = useMemo(() => parentScope ?? fork(), [parentScope])

  return (
    <Provider value={scope}>
      <editorModel.Gate
        externalLoading={loading}
        initialProject={initialProject}
        onPlayingChange={onPlayingChange}
        onSerialized={onSerialized}
        readonly={readonly}
        serializationTimeout={serializationTimeout}
      />
      <EditorUI />
    </Provider>
  )
}

const EditorUI = memo(() => (
  <Tooltip.Provider>
    <div className="relative size-full">
      <LoadingIndicator />
      <NodeCreationDialog />
      <EditorPanels />
    </div>
  </Tooltip.Provider>
))
