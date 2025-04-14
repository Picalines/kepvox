import { createQuery } from '@farfetched/core'
import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { createGate } from 'effector-react'
import { debounce, readonly, spread } from 'patronum'
import { searchPublications } from '../api'

export const createPublicationSearch = createFactory(() => {
  const Gate = createGate()

  const $namePart = createStore('')
  const $loading = createStore(true)

  const namePartChanged = createEvent<string>()

  const searchPublicationsQuery = createQuery({
    handler: async ({ namePart }: { namePart: string }) => await searchPublications({ namePart }),
  })

  const $publications = searchPublicationsQuery.$data.map(data => data?.publications ?? null)

  sample({
    clock: Gate.open,
    target: searchPublicationsQuery.start,
    fn: () => ({ namePart: '' }),
  })

  sample({
    clock: namePartChanged,
    target: spread({ namePart: $namePart, loading: $loading }),
    fn: namePart => ({ namePart, loading: true }),
  })

  sample({
    clock: debounce($namePart, 700),
    target: searchPublicationsQuery.refresh,
    fn: namePart => ({ namePart }),
  })

  sample({
    clock: searchPublicationsQuery.finished.finally,
    target: $loading,
    fn: () => false,
  })

  return {
    $loading: readonly($loading),
    $namePart: readonly($namePart),
    $publications: readonly($publications),
    Gate,
    namePartChanged,
  }
})
