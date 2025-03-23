'use server'

import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { DraftAuth } from './draft-auth'

const HomePage: FC = async () => {
  return (
    <>
      <div>
        <Text variant="heading-m">@kevpox/social</Text>
      </div>
      <div>
        <DraftAuth />
      </div>
    </>
  )
}

export default HomePage
