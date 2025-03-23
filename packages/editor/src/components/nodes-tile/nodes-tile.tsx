import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react'
import type { FC } from 'react'
import { Controls } from './controls'

import '@xyflow/react/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

const proOptions = { hideAttribution: true }

export const NodesTile: FC = () => {
  return (
    <ReactFlow nodes={initialNodes} edges={initialEdges} proOptions={proOptions}>
      <Controls />
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  )
}
