'use client'

import type { FC } from 'react'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { EditorHeader } from './editor-header'

import { JSEditor } from './js-editor'

export const EditorScreen: FC = () => {
  return (
    <Tooltip.Provider>
      <div className="h-screen">
        <EditorHeader />
        <JSEditor />
      </div>
    </Tooltip.Provider>
  )
}
