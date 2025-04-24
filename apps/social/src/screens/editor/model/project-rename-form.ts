import { createFactory } from '@withease/factories'
import { attach, combine, createEvent, createStore, sample } from 'effector'
import { createGate } from 'effector-react'
import { and, debounce, not, readonly, spread } from 'patronum'
import { updateProject } from '../api'

export const createProjectRenameForm = createFactory(() => {
  const $projectId = createStore('')
  const $name = createStore('')
  const $description = createStore('')

  const userChangedName = createEvent<string>()
  const userChangedDescription = createEvent<string>()

  const gate = createGate<{
    project: { id: string; name: string; description: string }
    refresh: () => void
  }>()

  const updateProjectFx = attach({
    source: { id: $projectId, name: $name, description: $description, props: gate.state },
    effect: async ({ props, ...project }) => {
      await updateProject({ project })
      props?.refresh()
    },
  })

  sample({
    clock: gate.state,
    target: spread({
      id: $projectId,
      name: $name,
      description: $description,
    }),
    fn: ({ project }) => project,
  })

  sample({
    clock: userChangedName,
    filter: and(gate.status, not(updateProjectFx.pending)),
    target: $name,
  })

  sample({
    clock: userChangedDescription,
    filter: and(gate.status, not(updateProjectFx.pending)),
    target: $description,
  })

  sample({
    clock: debounce(combine($name, $description), 1_000),
    filter: gate.status,
    target: updateProjectFx,
  })

  return {
    $description: readonly($description),
    $name: readonly($name),
    gate,
    userChangedDescription,
    userChangedName,
  }
})
