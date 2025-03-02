/**
 * See https://stackoverflow.com/a/47593316
 */
const mulberry32 = (initialState: number) => {
  let state = initialState
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const createSeededRandom = (seed: number) => mulberry32(seed)
