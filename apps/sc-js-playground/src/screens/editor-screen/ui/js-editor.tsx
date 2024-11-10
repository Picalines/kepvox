import { type FC, useCallback } from 'react'

import { Editor as MonacoEditor, type OnMount } from '@monaco-editor/react'

import scJsDeclaration from '!!raw-loader!@repo/sc-js/sc.d.ts'

export const JSEditor: FC = () => {
  const onMount = useCallback<OnMount>((editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'sc-js' {${scJsDeclaration}}`,
      'ts:sc.d.ts',
    )

    editor.updateOptions({ fontSize: 16 })
  }, [])

  return <MonacoEditor defaultLanguage="typescript" theme="vs-dark" onMount={onMount} />
}
