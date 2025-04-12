import { NODE_COLORS, NODE_TYPES } from '@repo/editor/meta'
import { Pitch, type PitchNotation } from '@repo/synth'
import { z } from 'zod'

const nodeIdSchema = z.string().min(1)

const edgeIdSchema = z.string().min(1)

const connectionPointSchema = z.object({
  node: nodeIdSchema,
  socket: z.number().int().nonnegative(),
})

const noteIdSchema = z.string().min(1)

export const projectSchema = z.object({
  synthTree: z.object({
    nodes: z.record(
      nodeIdSchema,
      z.object({
        position: z.object({ x: z.number(), y: z.number() }),
        type: z.enum(NODE_TYPES),
        params: z.record(z.string().min(1), z.union([z.number(), z.string()])).default({}),
        number: z.number().int().default(0),
        color: z.enum(NODE_COLORS).default('cyan'),
      }),
    ),
    edges: z.record(
      edgeIdSchema,
      z.object({
        source: connectionPointSchema,
        target: connectionPointSchema,
      }),
    ),
  }),
  musicSheet: z
    .object({
      endingNote: z.number().positive().default(5),
      notes: z.record(
        noteIdSchema,
        z.object({
          synth: nodeIdSchema,
          time: z.number(),
          duration: z.number(),
          pitch: z.custom<PitchNotation>(data => typeof data === 'string' && Pitch.isNotation(data)),
        }),
      ),
    })
    .default({ notes: {} }),
})
