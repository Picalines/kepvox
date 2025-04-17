import { createQuery } from '@farfetched/core'
import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { createGate } from 'effector-react'
import { debounce, readonly, spread } from 'patronum'
import { searchAuthors } from '../api'

export const createAuthorSearch = createFactory(() => {
  const Gate = createGate()

  const $namePart = createStore('')
  const $loading = createStore(true)

  const namePartChanged = createEvent<string>()

  const searchAuthorsQuery = createQuery({
    handler: async ({ namePart }: { namePart: string }) => await searchAuthors({ namePart }),
  })

  const $authors = searchAuthorsQuery.$data.map(data => data?.authors ?? null)

  sample({
    clock: Gate.open,
    target: searchAuthorsQuery.start,
    fn: () => ({ namePart: '' }),
  })

  sample({
    clock: namePartChanged,
    target: spread({ namePart: $namePart, loading: $loading }),
    fn: namePart => ({ namePart, loading: true }),
  })

  sample({
    clock: debounce($namePart, 700),
    target: searchAuthorsQuery.refresh,
    fn: namePart => ({ namePart }),
  })

  sample({
    clock: searchAuthorsQuery.finished.finally,
    target: $loading,
    fn: () => false,
  })

  return {
    $loading: readonly($loading),
    $namePart: readonly($namePart),
    $authors: readonly($authors),
    Gate,
    namePartChanged,
  }
})
