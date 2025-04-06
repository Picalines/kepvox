import type { Scope } from 'effector'
import { Provider as ScopeProvider } from 'effector-react'
import { type FC, type ReactNode, createContext, useContext } from 'react'

// <Editor/> might be used in other effector app,
// so using <Provider/> from effector directly ain't gonna work
const EditorScopeContext = createContext<Scope | null>(null)

type Props = {
  scope: Scope
  children: ReactNode
}

/**
 * @internal used only for testing for now
 */
export const EditorScope: FC<Props> = props => {
  const { scope, children } = props

  return (
    <EditorScopeContext.Provider value={scope}>
      <ScopeProvider value={scope}>{children}</ScopeProvider>
    </EditorScopeContext.Provider>
  )
}

/**
 * @internal used only for testing for now
 */
export const useEditorScope = (): Scope | null => {
  return useContext(EditorScopeContext)
}
