/**
 * Creates a dummy AudioContext that tells you that it's running
 * even if it's not the case. Use it in stories to test `isPlaying` state
 */
export const mockRunningAudioContext = () => {
  const RealAudioContext = window.AudioContext

  window.AudioContext = new Proxy(RealAudioContext, {
    construct: (target, args) => {
      return Object.defineProperty(new target(...args), 'state', {
        get: () => 'running',
      })
    },
  })

  return () => {
    window.AudioContext = RealAudioContext
  }
}
