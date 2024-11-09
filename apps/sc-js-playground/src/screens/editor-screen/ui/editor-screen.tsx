'use client'

import type { FC } from 'react'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { ScClientProvider } from '~/entities/sc-client'
import { ScServerProvider } from '~/entities/sc-server'
import { EditorHeader } from './editor-header'

import * as model from '../model'

export const EditorScreen: FC = () => {
  return (
    <ScServerProvider value={model.scServer}>
      <ScClientProvider value={model.scClient}>
        <Tooltip.Provider>
          <EditorHeader />
        </Tooltip.Provider>
      </ScClientProvider>
    </ScServerProvider>
  )
}
