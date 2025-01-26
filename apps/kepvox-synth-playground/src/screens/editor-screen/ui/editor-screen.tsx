'use server'

import type { FC } from 'react'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { CodeEditor } from './code-editor'
import { EditorHeader } from './editor-header'

export const EditorScreen: FC = async () => {
  return (
    <Tooltip.Provider>
      <div className="flex h-screen flex-col">
        <EditorHeader />
        <CodeEditor className="flex-grow" />
      </div>
    </Tooltip.Provider>
  )
}
