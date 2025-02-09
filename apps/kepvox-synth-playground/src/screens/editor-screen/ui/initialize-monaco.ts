import type { Monaco } from '@monaco-editor/react'

import synthPackageDts from '#public/synth.d.ts.txt'

type MonacoEditor = ReturnType<Monaco['editor']['create']>

const MONACO_TS_DECLARATIONS = [
  `declare module 'synth' {\n${synthPackageDts}\n}`,
  `declare module 'synth/playground' {\nimport { SynthContext } from 'synth';\nexport declare const context: SynthContext\n}`,
]

export const initializeMonaco = (editor: MonacoEditor, monaco: Monaco) => {
  editor.updateOptions({ fontSize: 16, theme: 'vs-dark', minimap: { enabled: false } })

  for (const dts of MONACO_TS_DECLARATIONS) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(dts)
  }
}
