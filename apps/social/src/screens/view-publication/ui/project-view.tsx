'use client'

import { Editor, type Project } from '@repo/editor'
import { type FC, useCallback, useRef } from 'react'
import { listenPublication } from '../api'

type Props = {
  publicationId: string
  project: Project
}

export const ProjectView: FC<Props> = props => {
  const { publicationId, project } = props

  const haveListened = useRef(false)

  const onPlayingChange = useCallback(
    (isPlaying: boolean) => {
      if (haveListened.current || !isPlaying) return

      haveListened.current = true
      void listenPublication({ publication: { id: publicationId } })
    },
    [publicationId],
  )

  return <Editor readonly initialProject={project} onPlayingChange={onPlayingChange} />
}
