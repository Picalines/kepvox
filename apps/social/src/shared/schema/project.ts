import { z } from 'zod'

const nodeIdSchema = z.string().min(1)

const edgeIdSchema = z.string().min(1)

const nodeTypeSchema = z.enum(['output', 'delay', 'gain', 'generator', 'oscillator', 'reverb'])

const positionSchema = z.object({ x: z.number(), y: z.number() })

const connectionPointSchema = z.object({
  node: nodeIdSchema,
  socket: z.number().int().nonnegative(),
})

const projectSchemaV1 = z.object({
  version: z.literal(1),
  synthTree: z.object({
    nodes: z.record(nodeIdSchema, z.object({ position: positionSchema, type: nodeTypeSchema })),
    edges: z.record(edgeIdSchema, z.object({ source: connectionPointSchema, target: connectionPointSchema })),
  }),
})

export const projectSchema = projectSchemaV1

export const migrateProject = (project: unknown): z.infer<typeof projectSchema> | null => {
  // TODO: migration algorithm
  const { success, data } = projectSchema.safeParse(project)
  return success ? data : null
}
