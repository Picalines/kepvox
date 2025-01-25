export function* range(stop: number, step = 1): Generator<number> {
  for (let index = 0; index < stop; index += step) {
    yield index
  }
}
