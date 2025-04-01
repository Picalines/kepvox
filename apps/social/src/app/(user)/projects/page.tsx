'use server'
import { Button } from '@repo/ui-kit/components/button'
import { Card } from '@repo/ui-kit/components/card'
import { Heading } from '@repo/ui-kit/components/heading'
import { Text } from '@repo/ui-kit/components/text'
import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import type { FC } from 'react'
import { authenticateOrRedirect } from '#shared/auth-server'
import { database, tables } from '#shared/database'
import { createProject } from './create-project'

const ProjectsPage: FC = async () => {
  const { user } = await authenticateOrRedirect()

  const projects = await database
    .select({
      id: tables.project.id,
      name: tables.project.name,
      description: tables.project.description,
      updatedAt: tables.project.updatedAt,
    })
    .from(tables.project)
    .where(eq(tables.project.authorId, user.id))
    .orderBy(desc(tables.project.updatedAt))

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
              <Text color="secondary">{project.updatedAt.toUTCString()}</Text>
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
