export const step = (value: number, stepWidth: number) => {
  return value - (value % stepWidth)
}
