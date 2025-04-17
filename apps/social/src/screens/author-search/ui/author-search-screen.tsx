'use client'

import { Heading } from '@repo/ui-kit/components/heading'
import { Loader } from '@repo/ui-kit/components/loader'
import { Text } from '@repo/ui-kit/components/text'
import { TextInput } from '@repo/ui-kit/components/text-input'
import { SearchIcon } from '@repo/ui-kit/icons'
import { invoke } from '@withease/factories'
import { useGate, useUnit } from 'effector-react'
import type { FC } from 'react'
import { createAuthorSearch } from '../model'
import { AuthorCard } from './author-card'

const authorSearch = invoke(createAuthorSearch)

export const AuthorSearchScreen: FC = () => {
  const { namePart, authors, loading, onNameChange } = useUnit({
    namePart: authorSearch.$namePart,
    authors: authorSearch.$authors,
    onNameChange: authorSearch.namePartChanged,
    loading: authorSearch.$loading,
  })

  useGate(authorSearch.Gate)

  return (
    <div className="space-y-4">
      <Heading.Root>
        <Heading.Title className="flex items-center gap-4">
          Authors <SearchIcon />
        </Heading.Title>
      </Heading.Root>
      <TextInput.Root value={namePart} onValueChange={onNameChange} className="max-w-60">
        <TextInput.Label className="flex items-center gap-1">Search</TextInput.Label>
      </TextInput.Root>
      {loading ? (
        <Loader centered />
      ) : authors?.length ? (
        <div className="flex flex-col gap-4">
          {authors.map(author => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      ) : (
        <Text variant="text-s" color="muted" className="mx-auto block w-min text-nowrap">
          Nothing found... Yet!
        </Text>
      )}
    </div>
  )
}
