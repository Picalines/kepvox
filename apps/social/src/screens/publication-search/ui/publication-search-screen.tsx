'use client'

import { Heading } from '@repo/ui-kit/components/heading'
import { Loader } from '@repo/ui-kit/components/loader'
import { Text } from '@repo/ui-kit/components/text'
import { TextInput } from '@repo/ui-kit/components/text-input'
import { SearchIcon } from '@repo/ui-kit/icons'
import { invoke } from '@withease/factories'
import { useGate, useUnit } from 'effector-react'
import type { FC } from 'react'
import { createPublicationSearch } from '../model'
import { PublicationCard } from './publication-card'

const publicationSearch = invoke(createPublicationSearch)

export const PublicationSearchScreen: FC = () => {
  const { namePart, publications, loading, onNameChange } = useUnit({
    namePart: publicationSearch.$namePart,
    publications: publicationSearch.$publications,
    onNameChange: publicationSearch.namePartChanged,
    loading: publicationSearch.$loading,
  })

  useGate(publicationSearch.Gate)

  return (
    <div className="space-y-4">
      <Heading.Root>
        <Heading.Title className="flex items-center gap-4">
          Tracks <SearchIcon />
        </Heading.Title>
      </Heading.Root>
      <TextInput.Root value={namePart} onValueChange={onNameChange} className="max-w-60">
        <TextInput.Label className="flex items-center gap-1">Search</TextInput.Label>
      </TextInput.Root>
      {loading ? (
        <Loader centered />
      ) : publications?.length ? (
        <div className="flex flex-wrap gap-4">
          {publications.map(publication => (
            <PublicationCard key={publication.id} publication={publication} />
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
