// NOTE: these symbols are meant to be used only inside the synth package

/**
 * The "design" is to make the package (at least the most part of its API) abstracted from the Web Audio API
 */
export const INTERNAL_AUDIO_CONTEXT: unique symbol = Symbol('Synth.internal.audioContext')

export const INTERNAL_LOOK_AHEAD: unique symbol = Symbol('Synth.internal.lookAhead')

export const INTERNAL_UNIT: unique symbol = Symbol('unit')
