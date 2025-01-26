'use client'

import { type FC, useCallback, useEffect } from 'react'

import {
  Editor as MonacoEditor,
  type OnChange as OnMonacoChange,
  type OnMount as OnMonacoMount,
} from '@monaco-editor/react'
import { useUnit } from 'effector-react'
import { model } from '../model'

const onMount: OnMonacoMount = editor => {
  editor.updateOptions({ fontSize: 16, automaticLayout: true })
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
