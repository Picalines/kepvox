import { Pitch, type PitchNote, type PitchOctave } from '@repo/synth'
import { cn } from '@repo/ui-kit/classnames'
import { useUnit } from 'effector-react'
import { type FC, useMemo } from 'react'
import { editorModel } from '#model'
import type { MusicSheetDimensions } from './music-sheet-dimensions'

type PianoRollProps = {
  dimensions: MusicSheetDimensions
}

export const MusicSheetPianoRoll: FC<PianoRollProps> = props => {
  const { dimensions } = props

  const { viewport } = useUnit({ viewport: editorModel.$sheetPosition })

  const octaves = useMemo(
    () =>
      Pitch.octaves
        .toReversed()
        .map(octave => <PianoRollOctave key={octave} dimensions={dimensions} octave={octave} />),
    [dimensions],
  )

  return (
    <div className="relative" style={{ top: viewport.y }}>
      {octaves}
    </div>
  )
}

const FULL_STEP_PITCHES: PitchNote[] = ['d', 'g', 'a']

type PianoRollOctaveProps = {
  dimensions: MusicSheetDimensions
  octave: PitchOctave
}

const PianoRollOctave: FC<PianoRollOctaveProps> = props => {
  const { dimensions, octave } = props

  const lineHeight = dimensions.note.height

  return (
    <div className="relative flex flex-col-reverse" style={{ height: dimensions.octave.height }}>
      {Pitch.names.map((name, keyIndex) => {
        const { isAccidental } = Pitch[name]

        const lineScale = FULL_STEP_PITCHES.includes(name) ? 2 : 1.5

        return (
          <button
            type="button"
            key={name}
            data-index={keyIndex}
            className={cn(
              '-outline-offset-1 block flex-grow select-none rounded-tr rounded-br pr-1 text-right outline-2 outline-border [&.down]:text-opacity-50',
              isAccidental
                ? 'absolute w-full max-w-[max(2.5ch+0.5rem,calc(100%-0.5rem-2.5ch))] bg-neutral-800 text-white dark:bg-neutral-950 dark:text-neutral-500'
                : 'bg-white text-secondary-foreground dark:bg-neutral-600 dark:text-neutral-900 [&.down]:bg-neutral-100 dark:[&.down]:bg-neutral-700',
            )}
            style={{
              maxHeight: lineHeight * lineScale,
              bottom: isAccidental ? keyIndex * lineHeight : 'auto',
            }}
          >
            {name.toUpperCase()}
            {octave}
          </button>
        )
      })}
    </div>
  )
}
