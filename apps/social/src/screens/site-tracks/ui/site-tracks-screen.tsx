'use client'

import { Heading } from '@repo/ui-kit/components/heading'
import { Loader } from '@repo/ui-kit/components/loader'
import { Text } from '@repo/ui-kit/components/text'
import { TextInput } from '@repo/ui-kit/components/text-input'
import { SearchIcon } from '@repo/ui-kit/icons'
import { invoke } from '@withease/factories'
import { useGate, useUnit } from 'effector-react'
import { type ChangeEventHandler, type FC, useCallback } from 'react'
import { createSiteTrackSearch } from '../model'
import { PublicationCard } from './publication-card'

const search = invoke(createSiteTrackSearch)

export const SiteTracksScreen: FC = () => {
  const { namePart, publications, loading, onNameChange } = useUnit({
    namePart: search.$namePart,
    publications: search.$publications,
    onNameChange: search.namePartChanged,
    loading: search.$loading,
  })

  useGate(search.Gate)

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => onNameChange(event.target.value),
    [onNameChange],
  )

  return (
    <div className="space-y-4">
      <Heading.Root>
        <Heading.Title className="flex items-center gap-2">
          Tracks <SearchIcon />
        </Heading.Title>
      </Heading.Root>
      <TextInput.Root value={namePart} onChange={onChange}>
        <TextInput.Label className="flex items-center gap-1">Search</TextInput.Label>
      </TextInput.Root>
      {loading ? (
        <Loader centered />
      ) : publications?.length ? (
        <div className="flex gap-2">
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
