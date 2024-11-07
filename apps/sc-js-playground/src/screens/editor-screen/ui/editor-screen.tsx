'use client'

import type { FC } from 'react'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { SCServerProvider, createSCServer } from '~/entities/sc-server'
import { EditorHeader } from './editor-header'

const SCServer = createSCServer()

export const EditorScreen: FC = () => {
  return (
    <SCServerProvider value={SCServer}>
      <Tooltip.Provider>
        <EditorHeader />
      </Tooltip.Provider>
    </SCServerProvider>
  )
}
