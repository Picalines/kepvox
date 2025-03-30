import { createGate } from 'effector-react'
import type { Project } from './project'

export const Gate = createGate<{ initialProject: Project }>()

export type EditorGate = typeof Gate
