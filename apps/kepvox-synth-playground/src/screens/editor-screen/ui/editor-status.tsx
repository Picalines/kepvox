'use client'

import { Heading } from '@repo/ui-kit/components/heading'
import { Text } from '@repo/ui-kit/components/text'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { model } from '../model'

export const EditorStatus: FC = () => {
  const { status, error } = useUnit({ status: model.$status, error: model.$error })

  if (status === 'initializing') {
    return <Text color="secondary">Initializing...</Text>
  }

  if (error) {
    return (
      <Heading.Root>
        <Heading.SuperTitle color="negative">{error.name}:</Heading.SuperTitle>
        <Heading.Title variant="text-m" color="negative">
          {error.message}
        </Heading.Title>
      </Heading.Root>
    )
  }

  return null
}
