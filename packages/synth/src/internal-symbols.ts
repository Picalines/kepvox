// NOTE: these symbols are meant to be used only inside the synth package

export const INTERNAL_CONTEXT_OWN: unique symbol = Symbol('SynthContext.internal.own')

/**
 * The "design" is to make the package (at least the most part of its API) abstracted from the Web Audio API
 */
export const INTERNAL_AUDIO_CONTEXT: unique symbol = Symbol('SynthContext.internal.audioContext')
