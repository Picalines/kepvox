import { assertDefined } from '@repo/common/assert'
import { SynthTime } from '@repo/synth'
import { Loader } from '@repo/ui-kit/components/loader'
import {
  Background,
  type CoordinateExtent,
  type NodeOrigin,
  type OnNodesChange,
  PanOnScrollMode,
  ReactFlow,
} from '@xyflow/react'
import { useUnit } from 'effector-react'
import { type FC, useCallback, useId, useMemo, useRef } from 'react'
import { type Note as SheetNote, editorModel } from '#model'
import { musicSheetDimensions } from './music-sheet-dimensions'
import { musicSheetNodeChangeToAction } from './music-sheet-flow-change'
import { MUSIC_SHEET_FLOW_NODES, type SheetNoteFlowNode } from './music-sheet-flow-nodes'

const FLOW_PRO_OPTIONS = { hideAttribution: true }

const DIMENSIONS = musicSheetDimensions({
  wholeNoteWidthPx: 250,
  halfStepHeightPx: 24,
})

const FLOW_EXTENTS: CoordinateExtent = [
  [0, DIMENSIONS.sheet.top],
  [Number.POSITIVE_INFINITY, DIMENSIONS.sheet.bottom],
]

export const MusicSheetTile: FC = () => {
  const { notes, isLoaded, dispatch } = useUnit({
    notes: editorModel.$sheetNotes,
    isLoaded: editorModel.$isLoaded,
    dispatch: editorModel.actionDispatched,
  })

  const flowNodeCache = useRef(new WeakMap<SheetNote, SheetNoteFlowNode>())

  const flowNodes = useMemo(
    () => mapWithWeakMemo(notes.values(), flowNodeCache.current, sheetNoteToFlow).toArray(),
    [notes],
  )

  const onNodesChange = useCallback<OnNodesChange>(
    changes =>
      changes
        .map(change =>
          musicSheetNodeChangeToAction({ dimensions: DIMENSIONS, timeStep: SynthTime.eighth.toNotes(), change }),
        )
        .filter(action => action !== null)
        .forEach(dispatch),
    [dispatch],
  )

  const id = useId() // NOTE: needed for this ReactFlow to be unique

  if (!isLoaded) {
    return <Loader centered />
  }

  return (
    <ReactFlow
      id={id}
      nodeTypes={MUSIC_SHEET_FLOW_NODES}
      nodes={flowNodes}
      onNodesChange={onNodesChange}
      minZoom={1}
      maxZoom={1}
      panOnDrag={false}
      height={DIMENSIONS.sheet.height}
      panOnScrollMode={PanOnScrollMode.Free}
      translateExtent={FLOW_EXTENTS}
      panOnScroll
      proOptions={FLOW_PRO_OPTIONS}
    >
      <Background />
    </ReactFlow>
  )
}

const NOTE_NODE_ORIGIN: NodeOrigin = [0, 0]

const sheetNoteToFlow = (note: SheetNote): SheetNoteFlowNode => {
  const width = DIMENSIONS.note.width(note.duration)
  const height = DIMENSIONS.note.height

  return {
    id: note.id,
    type: 'note',
    origin: NOTE_NODE_ORIGIN,
    position: { x: DIMENSIONS.note.left(note.time), y: DIMENSIONS.note.top(note.pitch) },
    width,
    height,
    measured: { width, height },
    selected: note.selected,
    data: {},
  }
}

const mapWithWeakMemo = <T extends WeakKey, U>(items: IteratorObject<T>, cache: WeakMap<T, U>, map: (item: T) => U) =>
  items.map(item => {
    if (cache.has(item)) {
      const cachedTransform = cache.get(item)
      assertDefined(cachedTransform)
      return cachedTransform
    }

    const transformed = map(item)
    cache.set(item, transformed)
    return transformed
  })
