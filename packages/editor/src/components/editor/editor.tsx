'use client'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { fork } from 'effector'
import { Provider } from 'effector-react'
import { type FC, useMemo } from 'react'
import { editorModel } from '#model'
import { EditorPanels } from './editor-panels'

export const Editor: FC = () => {
  const scope = useMemo(() => fork(), [])

  return (
    <Provider value={scope}>
      <editorModel.Gate />
      <Tooltip.Provider>
        <EditorPanels />
      </Tooltip.Provider>
    </Provider>
  )
}
