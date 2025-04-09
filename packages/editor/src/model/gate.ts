import { createGate } from 'effector-react'
import type { Project } from './project'

export const Gate = createGate<{
  initialProject: Project
  externalLoading: boolean
  serializationTimeout: number
  onSerialized?: (project: Project) => void
}>()

export type EditorGate = typeof Gate
