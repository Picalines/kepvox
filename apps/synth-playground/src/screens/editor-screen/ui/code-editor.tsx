'use client'

import { type FC, useCallback } from 'react'

import {
  Editor as MonacoEditor,
  type OnChange as OnMonacoChange,
  type OnMount as OnMonacoMount,
} from '@monaco-editor/react'
import { useUnit } from 'effector-react'
import { model } from '../model'
import { initializeMonaco } from './initialize-monaco'

type Props = {
  className?: string
}

export const CodeEditor: FC<Props> = props => {
  const { className } = props

  const { value, isReadonly, onChangeModel, onPlaybackToggle } = useUnit({
    value: model.$code,
    isReadonly: model.$isReadonly,
    onChangeModel: model.userChangedCode,
    onPlaybackToggle: model.userToggledPlayback,
  })

  const onChange = useCallback<OnMonacoChange>(newValue => onChangeModel(newValue ?? ''), [onChangeModel])

  const onMount = useCallback<OnMonacoMount>(
    (editor, monaco) => {
      initializeMonaco({ monaco, editor, onPlaybackToggleAction: onPlaybackToggle })
    },
    [onPlaybackToggle],
  )

  return (
    <div className={className}>
      <MonacoEditor
        onMount={onMount}
        value={value}
        onChange={onChange}
        defaultLanguage="typescript"
        options={{ automaticLayout: true, readOnly: isReadonly }}
      />
    </div>
  )
}
