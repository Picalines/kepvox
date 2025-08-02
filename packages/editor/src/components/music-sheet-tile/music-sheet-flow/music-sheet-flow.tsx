import { assertDefined } from '@repo/common/assert'
import { Time } from '@repo/synth'
import {
  type CoordinateExtent,
  type NodeOrigin,
  PanOnScrollMode,
  ReactFlow,
  type Viewport,
  useReactFlow,
} from '@xyflow/react'
import { useUnit } from 'effector-react'
import { type ComponentProps, type FC, useCallback, useEffect, useId, useMemo, useRef } from 'react'
import { type Note as SheetNote, editorModel } from '#model'
import type { MusicSheetDimensions } from '../music-sheet-dimensions'
import { MusicSheetBackground } from './music-sheet-background'
import { musicSheetNodeChangeToAction } from './music-sheet-flow-change'
import type { SheetNoteFlowNode } from './music-sheet-flow-nodes'
import { MUSIC_SHEET_FLOW_NODES } from './music-sheet-flow-nodes'
import { MusicSheetNotePreview } from './music-sheet-note-preview'

type ReactFlowProps = Required<ComponentProps<typeof ReactFlow>>

const FLOW_PRO_OPTIONS = { hideAttribution: true }

type Props = {
  dimensions: MusicSheetDimensions
  className?: string
}

export const MusicSheetFlow: FC<Props> = props => {
  const { dimensions, className } = props

  const {
    createNoteAtPreview,
    hideNotePreview,
    moveNotePreview,
    moveViewport,
    notes,
    requestActions,
    stretchNotePreview,
  } = useUnit({
    createNoteAtPreview: editorModel.userRequestedANote,
    hideNotePreview: editorModel.userHidNotePreview,
    moveNotePreview: editorModel.userMovedNotePreview,
    moveViewport: editorModel.userMovedSheet,
    notes: editorModel.$sheetNotes,
    requestActions: editorModel.userRequestedActions,
    stretchNotePreview: editorModel.userStretchedNotePreview,
  })

  const isHoveringNode = useRef(false)
  const isHoveringFlow = useRef(false)
  const flowNodeCache = useRef(new WeakMap<SheetNote, SheetNoteFlowNode>())

  const flowNodes = useMemo(
    () => mapWithWeakMemo(notes.values(), flowNodeCache.current, note => sheetNoteToFlow(dimensions, note)).toArray(),
    [notes, dimensions],
  )

  const onNodesChange = useCallback<ReactFlowProps['onNodesChange']>(
    changes => {
      if (isHoveringFlow.current) {
        requestActions(
          changes
            .map(change => musicSheetNodeChangeToAction({ dimensions, timeStep: Time.n8.notes, change }))
            .filter(action => action !== null),
        )
      }
    },
    [requestActions, dimensions],
  )

  const { screenToFlowPosition } = useReactFlow()

  const onMouseMove = useCallback<ReactFlowProps['onPaneMouseMove']>(
    event => {
      if (isHoveringNode.current) return
      const { x, y } = screenToFlowPosition({ x: event.clientX, y: event.clientY })

      const time = dimensions.note.time(x)
      const pitch = dimensions.note.pitch(y)

      if (event.buttons === 0) {
        moveNotePreview({ pitch, time })
      } else {
        stretchNotePreview({ until: time })
      }
    },
    [screenToFlowPosition, dimensions, moveNotePreview, stretchNotePreview],
  )

  const startHoveringFlow = useCallback(() => {
    isHoveringFlow.current = true
  }, [])

  const stopHoveringFlow = useCallback(() => {
    isHoveringFlow.current = false
    hideNotePreview()
  }, [hideNotePreview])

  const startHoveringNode = useCallback(() => {
    isHoveringNode.current = true
    hideNotePreview()
  }, [hideNotePreview])

  const stopHoveringNode = useCallback(() => {
    isHoveringNode.current = false
  }, [])

  const defaultViewport = useMemo<Viewport>(() => ({ x: 0, y: -dimensions.sheet.bottom / 2, zoom: 1 }), [dimensions])

  useEffect(() => {
    moveViewport(defaultViewport)
  }, [moveViewport, defaultViewport])

  const translateExtents = useMemo<CoordinateExtent>(
    () => [
      [0, dimensions.sheet.top],
      [Number.POSITIVE_INFINITY, dimensions.sheet.bottom],
    ],
    [dimensions],
  )

  const id = useId() // NOTE: needed for this ReactFlow to be unique

  return (
    <ReactFlow
      className={className}
      height={dimensions.sheet.height}
      id={id}
      maxZoom={1}
      minZoom={1}
      defaultViewport={defaultViewport}
      nodeTypes={MUSIC_SHEET_FLOW_NODES}
      nodes={flowNodes}
      onMouseEnter={startHoveringFlow}
      onMouseLeave={stopHoveringFlow}
      onMouseMove={onMouseMove}
      onNodeMouseLeave={stopHoveringNode}
      onNodeMouseMove={startHoveringNode}
      onNodesChange={onNodesChange}
      onNodesDelete={stopHoveringNode}
      onPaneClick={createNoteAtPreview}
      onSelectionStart={hideNotePreview}
      onViewportChange={moveViewport}
      panOnDrag={false}
      panOnScroll
      panOnScrollMode={PanOnScrollMode.Free}
      preventScrolling={false}
      proOptions={FLOW_PRO_OPTIONS}
      translateExtent={translateExtents}
    >
      <MusicSheetBackground dimensions={dimensions} />
      <MusicSheetNotePreview dimensions={dimensions} />
    </ReactFlow>
  )
}

const NOTE_NODE_ORIGIN: NodeOrigin = [0, 0]

const sheetNoteToFlow = (dimensions: MusicSheetDimensions, note: SheetNote): SheetNoteFlowNode => {
  const width = dimensions.note.width(note.duration)
  const height = dimensions.note.height

  return {
    id: note.id,
    type: 'note',
    origin: NOTE_NODE_ORIGIN,
    position: { x: dimensions.note.left(note.time), y: dimensions.note.top(note.pitch) },
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
