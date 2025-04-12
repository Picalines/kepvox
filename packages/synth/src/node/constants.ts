/**
 * By default, all Web Audio sources produce sound of volume 1,
 * which results in clipping if you try to do pretty much anything
 * more complex than a single oscillator
 *
 * I always forget about this, and this package is intended to
 * be a "smooth" wrapper. Please, use this constant in source SynthNodes
 */
export const DEFAULT_SOURCE_GAIN = 0.3125
