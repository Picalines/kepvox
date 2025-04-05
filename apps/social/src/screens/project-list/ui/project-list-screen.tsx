'use server'

import { Button } from '@repo/ui-kit/components/button'
import { Heading } from '@repo/ui-kit/components/heading'
import { Skeleton } from '@repo/ui-kit/components/skeleton'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { PlusIcon } from '@repo/ui-kit/icons'
import { type FC, Suspense } from 'react'
import { authenticateOrRedirect } from '#shared/auth-server'
import { createProject, getProjects } from '../api'
import { ProjectCard } from './project-card'

export const ProjectListScreen: FC = async () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Heading.Root>
          <Heading.Title>Projects</Heading.Title>
        </Heading.Root>
        <form action={createProject}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button type="submit" variant="outline" className="rounded-full p-2">
                <PlusIcon />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="right">New</Tooltip.Content>
            <Tooltip.Arrow />
          </Tooltip.Root>
        </form>
      </div>
      <Suspense fallback={<Skeleton className="h-40 w-60" />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}

const ProjectList: FC = async () => {
  const { user } = await authenticateOrRedirect()

  const projects = await getProjects({ authorId: user.id })

  return (
    <div className="flex flex-wrap gap-2">
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  )
}
