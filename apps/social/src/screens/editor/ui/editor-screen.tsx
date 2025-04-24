'use server'

import { Heading } from '@repo/ui-kit/components/heading'
import type { FC } from 'react'
import { BackButton } from '#shared/components/back-button'
import { ThemeSwitcher } from '#shared/components/theme-switcher'
import { getProject } from '../api'
import { EditorShell } from './editor-shell'
import { ProjectRenameButton } from './project-rename-button'
import { PublishLink } from './publish-link'

type Props = {
  projectId: string
}

export const EditorScreen: FC<Props> = async props => {
  const { projectId } = props

  const {
    project: { name, description, content },
  } = await getProject({ project: { id: projectId } })

  return (
    <div className="flex h-dvh w-dvw flex-col">
      <div className="flex h-16 items-center gap-2 border-b-2 p-2">
        <BackButton variant="ghost" fallbackPath="/projects" />
        <Heading.Root>
          <Heading.Title>{name}</Heading.Title>
          <Heading.Description>{description}</Heading.Description>
        </Heading.Root>
        <div className="grow" />
        <ProjectRenameButton variant="ghost" size="md" project={{ id: projectId, name, description }} />
        <PublishLink projectId={projectId} />
        <ThemeSwitcher variant="ghost" size="md" />
      </div>
      <div className="grow">
        <EditorShell projectId={projectId} content={content} />
      </div>
    </div>
  )
}
