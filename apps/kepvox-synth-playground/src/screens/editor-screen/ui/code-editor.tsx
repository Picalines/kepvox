'use client'

import { type FC, useCallback, useEffect, useRef } from 'react'

import {
  type Monaco,
  Editor as MonacoEditor,
  type OnChange as OnMonacoChange,
  type OnMount as OnMonacoMount,
} from '@monaco-editor/react'
import { useUnit } from 'effector-react'
import { model } from '../model'

import synthPackageDts from '#public/synth.d.ts.txt'

type Props = {
  className?: string
}

type MonacoEditorInstance = ReturnType<Monaco['editor']['create']>

const MONACO_TS_DECLARATIONS = [
  `declare module 'synth' {\n${synthPackageDts}\n}`,
  `declare module 'synth/playground' {\nimport { SynthContext } from 'synth';\nexport declare const context: SynthContext\n}`,
]

export const CodeEditor: FC<Props> = props => {
  const { className } = props

  const { value, isReadonly, onChangeModel, setupRunner } = useUnit({
    value: model.$code,
    isReadonly: model.$isReadonly,
    onChangeModel: model.codeChanged,
    setupRunner: model.initialized,
    example: model.$example,
  })

  const editorRef = useRef<MonacoEditorInstance>(null)

  const onMount = useCallback<OnMonacoMount>(async (editor, monaco) => {
    editorRef.current = editor

    editor.updateOptions({ fontSize: 16, automaticLayout: true })

    for (const dts of MONACO_TS_DECLARATIONS) {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(dts)
    }
  }, [])

  const onChange = useCallback<OnMonacoChange>(newValue => onChangeModel(newValue ?? ''), [onChangeModel])

  useEffect(() => setupRunner(), [setupRunner])

  return (
    <div className={className}>
      <MonacoEditor
        onMount={onMount}
        value={value}
        onChange={onChange}
        defaultLanguage="typescript"
        theme="vs-dark"
        options={{ readOnly: isReadonly }}
      />
    </div>
  )
}
