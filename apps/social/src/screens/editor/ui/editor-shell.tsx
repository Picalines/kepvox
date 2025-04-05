'use client'

import { Editor, type Project as SerializedProject } from '@repo/editor'
import { type FC, useCallback, useState } from 'react'
import type { z } from 'zod'
import type { projectSchema } from '#shared/schema'
import { updateProject } from '../api'

type Props = {
  projectId: string
  content: z.infer<typeof projectSchema>
}

export const EditorShell: FC<Props> = props => {
  const { projectId, content } = props

  const { version, ...contentWithoutId } = content

  const [loading, setLoading] = useState(false)

  const onProjectSerialized = useCallback(
    async (project: SerializedProject) => {
      setLoading(true)
      await updateProject({
        project: {
          id: projectId,
          content: { ...project, version },
        },
      })
      setLoading(false)
    },
    [projectId, version],
  )

  return <Editor initialProject={contentWithoutId} loading={loading} onProjectSerialized={onProjectSerialized} />
}
