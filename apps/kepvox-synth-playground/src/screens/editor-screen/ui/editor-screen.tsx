'use server'

import type { FC } from 'react'

import { TooltipProvider } from '@repo/ui-kit/components/tooltip'
import { EditorHeader } from './editor-header'

import { JSEditor } from './js-editor'

export const EditorScreen: FC = async () => {
  return (
    <TooltipProvider>
      <div className="h-screen">
        <EditorHeader />
        <JSEditor />
      </div>
    </TooltipProvider>
  )
}
