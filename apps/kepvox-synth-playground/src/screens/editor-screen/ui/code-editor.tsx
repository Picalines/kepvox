'use client'

import { type FC, useCallback, useEffect } from 'react'

import { Editor as MonacoEditor, type OnChange as OnMonacoChange } from '@monaco-editor/react'
import { useUnit } from 'effector-react'
import { model } from '../model'
import { initializeMonaco } from './initialize-monaco'

type Props = {
  className?: string
}

export const CodeEditor: FC<Props> = props => {
  const { className } = props

  const { value, isReadonly, onChangeModel, setupRunner } = useUnit({
    value: model.$code,
    isReadonly: model.$isReadonly,
    onChangeModel: model.codeChanged,
    setupRunner: model.initialized,
    example: model.$example,
  })

  const onChange = useCallback<OnMonacoChange>(newValue => onChangeModel(newValue ?? ''), [onChangeModel])

  useEffect(() => setupRunner(), [setupRunner])

  return (
    <div className={className}>
      <MonacoEditor
        onMount={initializeMonaco}
        value={value}
        onChange={onChange}
        defaultLanguage="typescript"
        options={{ automaticLayout: true, readOnly: isReadonly }}
      />
    </div>
  )
}
