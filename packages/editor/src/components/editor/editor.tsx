'use client'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { fork } from 'effector'
import { Provider, useProvidedScope, useUnit } from 'effector-react'
import { type FC, useEffect, useMemo } from 'react'
import { AudioPermissionDialog } from '#components/audio-permission-dialog'
import { LoadingIndicator } from '#components/loading-indicator'
import { PlaybackControls } from '#components/playback-controls'
import { type Project, editorModel } from '#model'
import { EditorPanels } from './editor-panels'

type Props = {
  initialProject: Project
  loading?: boolean
  onProjectSerialized?: (project: Project) => void
}

export const Editor: FC<Props> = props => {
  const { initialProject, loading = false, onProjectSerialized } = props

  const parentScope = useProvidedScope()
  const scope = useMemo(() => parentScope ?? fork(), [parentScope])

  return (
    <Provider value={scope}>
      <editorModel.Gate initialProject={initialProject} externalLoading={loading} />
      <ProjectWatcher onProjectSerialized={onProjectSerialized} />
      <Tooltip.Provider>
        <div className="relative h-full w-full">
          <LoadingIndicator />
          <AudioPermissionDialog />
          <EditorPanels />
          <div className="-translate-x-1/2 absolute bottom-4 left-1/2">
            <PlaybackControls />
          </div>
        </div>
      </Tooltip.Provider>
    </Provider>
  )
}

const ProjectWatcher: FC<Pick<Props, 'onProjectSerialized'>> = props => {
  const { onProjectSerialized } = props

  const { project } = useUnit({ project: editorModel.$serializedProject })

  useEffect(() => {
    if (project) {
      onProjectSerialized?.(project)
    }
  }, [project, onProjectSerialized])

  return null
}
