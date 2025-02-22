'use server'

import type { FC } from 'react'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { CodeEditor } from './code-editor'
import { EditorHeader } from './editor-header'
import { EditorScreenGate } from './editor-screen-gate'

export const EditorScreen: FC = async () => {
  return (
    <Tooltip.Provider>
      <EditorScreenGate />
      <div className="flex h-screen flex-col">
        <EditorHeader />
        <CodeEditor className="flex-grow" />
      </div>
    </Tooltip.Provider>
  )
}
