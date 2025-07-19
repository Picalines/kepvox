'use client'

import { Editor } from '@repo/editor'
import type { FC } from 'react'
import { defaultProject } from '../model'
import { EditorMenubar } from './editor-menubar'

export const EditorScreen: FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <EditorMenubar />
      <Editor initialProject={defaultProject} />
    </div>
  )
}
