'use client'

import { Separator } from '@repo/ui-kit/components/separator'
import { Text } from '@repo/ui-kit/components/text'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { model } from '../model'

const SECONDS_BREAKPOINTS = [60]
const NOTES_BREAKPOINTS = [64, 16]
const NOTES_DISPLAY_LENGTHS = [1, 1, 2]

export const PlaybackTimer: FC = () => {
  const { status, elapsedSeconds, elapsedNotes } = useUnit({
    status: model.$status,
    elapsedSeconds: model.$elapsedSeconds,
    elapsedNotes: model.$elapsedNotes,
  })

  const secondsDisplay = formatDivisions(divisions(Math.floor(elapsedSeconds), SECONDS_BREAKPOINTS), ':', 2)

  const notesDisplay = formatDivisions(
    divisions(Math.floor(elapsedNotes * 64), NOTES_BREAKPOINTS),
    ':',
    NOTES_DISPLAY_LENGTHS,
  )

  if (status !== 'playing') {
    return null
  }

  return (
    <div className="flex h-1/2 items-center gap-2">
      <Text color="secondary">{secondsDisplay}</Text>
      <Separator orientation="vertical" />
      <Text color="secondary">{notesDisplay}</Text>
    </div>
  )
}

const divisions = (total: number, breakpoints: number[]) =>
  breakpoints.reduceRight(
    (p, b) => (r: number) => [Math.floor(r / b)].concat(p(r % b)),
    (r: number) => [r],
  )(total)

const formatDivisions = (divisions: number[], separator: string, minLength: number | number[]) =>
  divisions
    .map((d, i) => String(d).padStart(typeof minLength === 'number' ? minLength : (minLength[i] ?? 0), '0'))
    .join(separator)
