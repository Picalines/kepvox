import type { FC } from 'react'
import { AuthorScreen } from '#screens/author'

type Props = {
  params: Promise<{ id: string }>
}

const AuthorPage: FC<Props> = async props => {
  const { params } = props

  const { id } = await params

  return <AuthorScreen id={id} />
}

export default AuthorPage
