'use client'

import { Editor, type Project } from '@repo/editor'
import { buttonVariants } from '@repo/ui-kit/components/button'
import { Heading } from '@repo/ui-kit/components/heading'
import Link from 'next/link'
import { type FC, useCallback, useState } from 'react'
import type { z } from 'zod'
import { BackButton } from '#shared/components/back-button'
import type { projectSchema } from '#shared/schema'
import { updateProject } from './update-project'

type Props = {
  project: {
    id: string
    name: string
    description: string
    content: z.infer<typeof projectSchema>
  }
}

export const ProjectEditorPage: FC<Props> = props => {
  const {
    project: { id, name, description, content },
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
    <div className="flex h-dvh w-dvw flex-col">
      <div className="flex h-min items-center gap-2 border-b-2 p-2">
        <BackButton variant="ghost" />
        <Heading.Root>
          <Heading.Title>{name}</Heading.Title>
          <Heading.Description>{description}</Heading.Description>
        </Heading.Root>
        <div className="grow" />
        <Link href={`/projects/${id}/publish`} className={buttonVariants({ variant: 'ghost' })}>
          Publish
        </Link>
      </div>
      <div className="grow">
        <Editor initialProject={content} loading={loading} onProjectSerialized={onProjectSerialized} />
      </div>
    </div>
  )
}
