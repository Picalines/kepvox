export const never = <T = unknown>(): Promise<T> => {
  return new Promise<T>(() => {})
}

export const wait = (delayMs: number): Promise<void> => {
  if (Number.isNaN(delayMs) || delayMs < 0) {
    throw new Error(`the argument ${delayMs} is not a valid delay`)
  }

  if (!Number.isFinite(delayMs)) {
    return never()
  }

  return new Promise(resolve => setTimeout(() => resolve(undefined), delayMs))
}

export const waitUntil = (checkIntervalMs: number, resolvePredicate: () => boolean): Promise<void> => {
  if (Number.isNaN(checkIntervalMs) || checkIntervalMs < 0) {
    throw new Error(`the argument ${checkIntervalMs} is not a valid interval`)
  }

  if (!Number.isFinite(checkIntervalMs)) {
    return never()
  }

  if (resolvePredicate()) {
    return Promise.resolve()
  }

  return new Promise(resolve => {
    const intervalId = window.setInterval(() => {
      if (resolvePredicate()) {
        window.clearInterval(intervalId)
        resolve()
      }
    }, checkIntervalMs)
  })
}
