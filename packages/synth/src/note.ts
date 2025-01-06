export const NOTE_DURATIONS = ['8', '4', '2', '1', '1/2', '1/4', '1/8', '1/16', '1/32'] as const

export type NoteDuration = (typeof NOTE_DURATIONS)[number]

export const NOTE_SYMBOLS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

export type NoteSymbol = (typeof NOTE_SYMBOLS)[number]

export const NOTE_OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export type NoteOctave = (typeof NOTE_OCTAVES)[number]
