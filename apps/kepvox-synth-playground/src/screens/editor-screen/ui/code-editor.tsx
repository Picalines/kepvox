'use client'

import { type FC, useCallback, useEffect } from 'react'

import {
  Editor as MonacoEditor,
  type OnChange as OnMonacoChange,
  type OnMount as OnMonacoMount,
} from '@monaco-editor/react'
import { useUnit } from 'effector-react'
import { model } from '../model'

import synthPackageDts from '#public/synth.d.ts.txt'

const onMount: OnMonacoMount = async (editor, monaco) => {
  editor.updateOptions({ fontSize: 16, automaticLayout: true })

  monaco.languages.typescript.typescriptDefaults.addExtraLib(`declare module 'synth' {\n${synthPackageDts}\n}`)
}

type Props = {
  className?: string
}

export const CodeEditor: FC<Props> = props => {
  const { className } = props

  const { value, onChangeModel, startup } = useUnit({
    value: model.$code,
    onChangeModel: model.codeChanged,
    startup: model.startup,
  })

  const onChange = useCallback<OnMonacoChange>(newValue => onChangeModel(newValue ?? ''), [onChangeModel])

  useEffect(() => startup(), [startup])

  return (
    <div className={className}>
      <MonacoEditor onMount={onMount} value={value} onChange={onChange} defaultLanguage="typescript" theme="vs-dark" />
    </div>
  )
}
