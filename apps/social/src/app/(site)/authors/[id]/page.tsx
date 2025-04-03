import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { getAuthor } from './get-author'
import { subscribeToAuthor } from './subscribe-to-author'

type Props = {
  params: Promise<{ id: string }>
}

const AuthorPage: FC<Props> = async props => {
  const { params } = props

  const { id: authorId } = await params

  const authorData = await getAuthor({ author: { id: authorId } })

  return (
    <>
      <form
        action={async () => {
          'use server'
          await subscribeToAuthor({ author: { id: authorId } })
        }}
      >
        <Button type="submit">Subscribe</Button>
      </form>
      <div>
        <Text>
          <pre>{JSON.stringify(authorData, null, 2)}</pre>
        </Text>
      </div>
    </>
  )
}

export default AuthorPage
