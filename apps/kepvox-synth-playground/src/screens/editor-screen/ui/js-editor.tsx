'use client'

import type { FC } from 'react'

import { Editor as MonacoEditor, type OnMount } from '@monaco-editor/react'

const onMount: OnMount = editor => {
  editor.updateOptions({ fontSize: 16 })
}

export const JSEditor: FC = () => {
  return <MonacoEditor defaultLanguage="typescript" theme="vs-dark" onMount={onMount} />
}
