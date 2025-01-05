export const clamp = (x: number, min: number, max: number) => {
  if (Number.isNaN(x) || Number.isNaN(min) || Number.isNaN(max)) {
    throw new Error('clamp received NaN')
  }

  if (min > max) {
    throw new Error('clamp received min > max')
  }

  return Math.max(min, Math.min(x, max))
}
