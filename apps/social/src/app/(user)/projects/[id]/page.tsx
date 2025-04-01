import { isTuple } from '@repo/common/array'
import { and, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import { authenticateOrRedirect } from '#shared/auth-server'
import { database, tables } from '#shared/database'
import { migrateProject } from '#shared/schema'
import { ProjectEditorPage } from './project-editor-page'

type Props = {
  params: Promise<{ id: string }>
}

const ProjectPage: FC<Props> = async props => {
  const { params } = props

  const { user } = await authenticateOrRedirect()

  const { id: projectId } = await params

  const selectedProjects = await database
    .select({ content: tables.project.content })
    .from(tables.project)
    .where(and(eq(tables.project.id, projectId), eq(tables.project.authorId, user.id)))

  if (!isTuple(selectedProjects, 1)) {
    notFound()
  }

  const [{ content: oldProjectContent }] = selectedProjects

  const content = migrateProject(oldProjectContent)

  if (!content) {
    throw new Error('project migration failed')
  }

  return <ProjectEditorPage project={{ id: projectId, content }} />
}

export default ProjectPage
