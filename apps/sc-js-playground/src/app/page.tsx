'use client'

import { ScClient } from '@repo/sc-js'
import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import { LoaderIcon, PlayIcon } from '@repo/ui-kit/icons'
import { useCallback, useState } from 'react'

const SC_PORT = 57110

let booted = false

const bootSuperCollider = () => {
  if (booted) {
    return
  }

  const SC = Module
  const args = [...SC.arguments]
  args[args.indexOf('-o') + 1] = '2'
  args[args.indexOf('-u') + 1] = String(SC_PORT)
  SC.callMain(args)

  booted = true
}

export default function Home() {
  const [connecting, setConnecting] = useState(false)

  const onPlay = useCallback(async () => {
    if (connecting) {
      return
    }

    bootSuperCollider()

    setConnecting(true)
    const client = await ScClient.connect({ port: SC_PORT, timeout: 10_000 })
    setConnecting(false)

    // biome-ignore lint: temporary
    console.log(client ? 'connected!' : 'not connected', client)
  }, [connecting])

  return (
    <div className="p-2">
      <Text className="block">Welcome to sc-js-playground!</Text>
      <Button size="md" shape="square" className="relative" onClick={onPlay}>
        {connecting ? <LoaderIcon className="absolute animate-spin" /> : <PlayIcon className="absolute" />}
      </Button>
    </div>
  )
}
