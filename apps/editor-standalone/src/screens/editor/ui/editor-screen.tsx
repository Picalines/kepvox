'use client'

import { Editor } from '@repo/editor'
import { useUnit } from 'effector-react'
import { nanoid } from 'nanoid'
import { type FC, useMemo } from 'react'
import { model } from '../model'
import { EditorHeader } from './editor-header'

export const EditorScreen: FC = () => {
  const { loadedProject, onSerialized } = useUnit({
    loadedProject: model.$loadedProject,
    onSerialized: model.userChangedProject,
  })

  // remount Editor when a new project is loaded
  const editorKey = useMemo(() => loadedProject && nanoid(), [loadedProject])

  return (
    <div className="flex h-screen w-screen flex-col">
      <model.Gate />
      <EditorHeader />
      <Editor key={editorKey} initialProject={loadedProject} onSerialized={onSerialized} />
    </div>
  )
}
