import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { getAuthor } from './get-author'

type Props = {
  params: Promise<{ id: string }>
}

const AuthorPage: FC<Props> = async props => {
  const { params } = props

  const { id: authorId } = await params

  const authorData = await getAuthor({ author: { id: authorId } })

  return (
    <>
      <div>
        <Text>
          <pre>{JSON.stringify(authorData, null, 2)}</pre>
        </Text>
      </div>
    </>
  )
}

export default AuthorPage
