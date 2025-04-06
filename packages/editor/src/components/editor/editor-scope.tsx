import type { Scope } from 'effector'
import { Provider as ScopeProvider } from 'effector-react'
import type { FC, ReactNode } from 'react'

type Props = {
  scope: Scope
  children: ReactNode
}

/**
 * @internal used only for testing for now
 */
export const EditorScope: FC<Props> = props => {
  const { scope, children } = props

  return <ScopeProvider value={scope}>{children}</ScopeProvider>
}
