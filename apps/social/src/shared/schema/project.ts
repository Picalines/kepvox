import { z } from 'zod'

const nodeIdSchema = z.string().min(1)

const edgeIdSchema = z.string().min(1)

const nodeTypeSchema = z.enum(['output', 'delay', 'gain', 'generator', 'oscillator', 'reverb'])

const positionSchema = z.object({ x: z.number(), y: z.number() })

const connectionPointSchema = z.object({
  node: nodeIdSchema,
  socket: z.number().int().nonnegative(),
})

export const projectSchema = z.object({
  synthTree: z.object({
    nodes: z.record(
      nodeIdSchema,
      z.object({
        position: positionSchema,
        type: nodeTypeSchema,
        params: z.record(z.string().min(1), z.union([z.number(), z.string()])).default({}),
      }),
    ),
    edges: z.record(edgeIdSchema, z.object({ source: connectionPointSchema, target: connectionPointSchema })),
  }),
})
