'use server'

import { Button } from '@repo/ui-kit/components/button'
import { Card } from '@repo/ui-kit/components/card'
import { Heading } from '@repo/ui-kit/components/heading'
import { Text } from '@repo/ui-kit/components/text'
import Link from 'next/link'
import type { FC } from 'react'
import { authenticateOrRedirect } from '#shared/auth-server'
import { createProject } from './create-project'
import { getProjects } from './get-projects'

const ProjectsPage: FC = async () => {
  const { user } = await authenticateOrRedirect()

  const projects = await getProjects({ authorId: user.id })

  return (
    <div className="flex flex-col gap-2 p-2">
      {projects.map(project => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <Card.Root className="h-40 w-60">
            <Card.Header>
              <Heading.Root>
                <Heading.Title>{project.name}</Heading.Title>
                <Heading.Description>{project.description}</Heading.Description>
              </Heading.Root>
            </Card.Header>
            <Card.Footer>
              <Text color="muted">{project.updatedAt.toUTCString()}</Text>
            </Card.Footer>
          </Card.Root>
        </Link>
      ))}
      <form action={createProject}>
        <Button type="submit">Create project</Button>
      </form>
    </div>
  )
}

export default ProjectsPage
