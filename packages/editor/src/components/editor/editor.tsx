'use client'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { fork } from 'effector'
import { Provider, useUnit } from 'effector-react'
import { type FC, useEffect, useMemo } from 'react'
import { type Project, editorModel } from '#model'
import { EditorPanels } from './editor-panels'

type Props = {
  initialProject: Project
  onProjectSerialized: (project: Project) => void
}

export const Editor: FC<Props> = props => {
  const { initialProject, onProjectSerialized } = props

  const scope = useMemo(() => fork(), [])

  return (
    <Provider value={scope}>
      <editorModel.Gate initialProject={initialProject} />
      <ProjectWatcher onProjectSerialized={onProjectSerialized} />
      <Tooltip.Provider>
        <EditorPanels />
      </Tooltip.Provider>
    </Provider>
  )
}

const ProjectWatcher: FC<Pick<Props, 'onProjectSerialized'>> = props => {
  const { onProjectSerialized } = props

  const { project } = useUnit({ project: editorModel.$serializedProject })

  useEffect(() => {
    if (project) {
      onProjectSerialized(project)
    }
  }, [project, onProjectSerialized])

  return null
}
