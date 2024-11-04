'use client'

import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import { PlayIcon } from '@repo/ui-kit/icons'

export default function Home() {
  return (
    <div className="p-2">
      <Text className="block">Welcome to sc-js-playground!</Text>
      <Button size="md" shape="square" className="relative">
        <PlayIcon className="absolute" />
      </Button>
    </div>
  )
}
