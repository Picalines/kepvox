import type { Project as EditorProject } from '@repo/editor'
import { expectTypeOf, test } from 'vitest'
import { projectSchema } from './project'

test("projectSchema should be assignable to editor package's Project", () => {
  const parsedProject = projectSchema.parse({})
  expectTypeOf(parsedProject).toMatchTypeOf<EditorProject>()
})
