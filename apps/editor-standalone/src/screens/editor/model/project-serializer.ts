import type { Project } from '@repo/editor'
import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { persist as persistInQuery } from 'effector-storage/query'
import { once, readonly } from 'patronum'
import { base64Url } from '#shared/lib/base64-url'
import { defaultProject } from './default-project'
import type { EditorGate } from './gate'

export type ProjectSerializerStore = ReturnType<typeof createProjectSerializer>

type Params = {
  gate: EditorGate
}

export const createProjectSerializer = createFactory((params: Params) => {
  const { gate } = params

  const $loadedProject = createStore<Project>(defaultProject)

  const userChangedProject = createEvent<Project>()
  const storageUpdated = createEvent<Project | null>()

  persistInQuery({
    key: 'project',
    source: userChangedProject,
    pickup: sample({
      clock: gate.opened,
      // TODO: maybe find another way to fix this
      filter: () => !process.env.STORYBOOK,
    }),
    target: storageUpdated,
    serialize: obj => base64Url.encode(JSON.stringify(obj)),
    deserialize: query => JSON.parse(base64Url.decode(query)) as Project,
  })

  sample({
    clock: once(storageUpdated),
    filter: project => project !== null,
    target: $loadedProject,
  })

  return {
    $loadedProject: readonly($loadedProject),
    userChangedProject,
  }
})
