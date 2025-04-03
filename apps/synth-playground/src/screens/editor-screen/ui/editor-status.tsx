'use client'

import { Heading } from '@repo/ui-kit/components/heading'
import { Text } from '@repo/ui-kit/components/text'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { model } from '../model'

export const EditorStatus: FC = () => {
  const { status, error } = useUnit({ status: model.$status, error: model.$jsError })

  if (status === 'initializing') {
    return <Text color="muted">Initializing...</Text>
  }

  if (error) {
    return (
      <Heading.Root>
        <Heading.SuperTitle color="destructive">{error.name}:</Heading.SuperTitle>
        <Heading.Title variant="text-m" color="destructive">
          {error.message}
        </Heading.Title>
      </Heading.Root>
    )
  }

  return null
}
