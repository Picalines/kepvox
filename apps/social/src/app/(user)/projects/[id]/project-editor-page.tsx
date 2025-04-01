'use client'

import { Editor, type Project } from '@repo/editor'
import { type FC, useCallback } from 'react'
import type { z } from 'zod'
import type { projectSchema } from '#shared/schema'
import { updateProject } from './update-project'

type Props = {
  project: { id: string; content: z.infer<typeof projectSchema> }
}

export const ProjectEditorPage: FC<Props> = props => {
  const {
    project: { id, content },
  } = props

  const { version } = content

  const onProjectSerialized = useCallback(
    (project: Project) => updateProject({ project: { id, content: { ...project, version } } }),
    [id, version],
  )

  return (
    <div className="h-dvh w-dvw">
      <Editor initialProject={content} onProjectSerialized={onProjectSerialized} />
    </div>
  )
}
