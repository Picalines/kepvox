'use client'

import type { FC } from 'react'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { model } from '../model'
import { CodeEditor } from './code-editor'
import { EditorHeader } from './editor-header'

export const EditorScreen: FC = () => {
  return (
    <Tooltip.Provider>
      <model.Gate />
      <div className="flex h-screen flex-col">
        <EditorHeader />
        <CodeEditor className="flex-grow" />
      </div>
    </Tooltip.Provider>
  )
}
