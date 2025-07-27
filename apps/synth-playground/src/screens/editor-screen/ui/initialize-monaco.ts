import type { Monaco } from '@monaco-editor/react'

import synthPackageDts from '#public/synth.d.ts.txt'

type MonacoEditor = ReturnType<Monaco['editor']['create']>

type Params = {
  monaco: Monaco
  editor: MonacoEditor
  onPlaybackToggleAction?: () => void
}

export const initializeMonaco = (params: Params) => {
  const { monaco, editor, onPlaybackToggleAction } = params

  loadTypesccriptLibs(monaco)

  editor.updateOptions({
    fontSize: 16,
    theme: 'vs-dark',
    minimap: { enabled: false },
  })

  editor.addAction({
    id: 'kepvox-toggle-playback',
    label: 'Kepvox: Toggle playback',

    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],

    run: () => {
      onPlaybackToggleAction?.()
    },
  })
}

const loadTypesccriptLibs = (monaco: Monaco) => {
  const declarations = [
    `declare module 'synth' {\n${synthPackageDts}\n}`,
    `declare module 'synth/playground' {\nimport { Synth } from 'synth';\nexport declare const synth: Synth\n}`,
  ]

  for (const dts of declarations) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(dts)
  }
}
