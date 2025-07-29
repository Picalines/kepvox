'use client'

import { Editor } from '@repo/editor'
import type { FC } from 'react'
import { defaultProject } from '../model'
import { EditorHeader } from './editor-header'

export const EditorScreen: FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <EditorHeader />
      <Editor initialProject={defaultProject} />
    </div>
  )
}
