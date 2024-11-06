interface Window {
  Module: Readonly<{
    arguments: string[]
    callMain: (args: string[]) => void
  }>
}
