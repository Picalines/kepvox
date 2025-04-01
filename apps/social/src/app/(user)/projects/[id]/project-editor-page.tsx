'use client'

import { Editor, type Project } from '@repo/editor'
import { type FC, useCallback, useState } from 'react'
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

  const [loading, setLoading] = useState(false)

  const onProjectSerialized = useCallback(
    async (project: Project) => {
      setLoading(true)
      await updateProject({ project: { id, content: { ...project, version } } })
      setLoading(false)
    },
    [id, version],
  )

  return (
    <div className="h-dvh w-dvw">
      <Editor initialProject={content} loading={loading} onProjectSerialized={onProjectSerialized} />
    </div>
  )
}
