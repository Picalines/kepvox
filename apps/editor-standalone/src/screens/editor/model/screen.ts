import { invoke } from '@withease/factories'
import { createEditorGate } from './gate'
import { createProjectSerializer } from './project-serializer'

const gate = invoke(createEditorGate)
const serializer = invoke(createProjectSerializer, { gate })

const { Gate } = gate
const { $loadedProject, userChangedProject } = serializer

export { $loadedProject, Gate, userChangedProject }
