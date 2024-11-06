let booted = false

type BootConfig = {
  port: number
  numberOfOutputs?: number
  numberOfInputs?: number
}

// TODO: actually wait for ready status
export async function bootSuperCollider(config: BootConfig) {
  if (booted) {
    return
  }

  const SC = window.Module
  const args = [...SC.arguments]

  const { port, numberOfOutputs = 2, numberOfInputs = 0 } = config

  setArgumentFlag(args, '-u', String(port))
  setArgumentFlag(args, '-o', String(numberOfOutputs))
  setArgumentFlag(args, '-i', String(numberOfInputs))

  SC.callMain(args)
  booted = true
}

function setArgumentFlag(args: string[], flag: string, value: string) {
  const argIndex = args.indexOf(flag)

  if (argIndex === -1) {
    args.push(flag, value)
  } else {
    args[argIndex + 1] = value
  }
}
