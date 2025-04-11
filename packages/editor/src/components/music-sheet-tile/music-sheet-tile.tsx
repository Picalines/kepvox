import { assertDefined } from '@repo/common/assert'
import { SynthTime } from '@repo/synth'
import { Loader } from '@repo/ui-kit/components/loader'
import {
  type CoordinateExtent,
  type NodeOrigin,
  PanOnScrollMode,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'
import { useUnit } from 'effector-react'
import { type ComponentProps, type FC, useCallback, useId, useMemo, useRef } from 'react'
import { type Note as SheetNote, editorModel } from '#model'
import { MusicSheetBackground } from './music-sheet-background'
import { musicSheetDimensions } from './music-sheet-dimensions'
import { musicSheetNodeChangeToAction } from './music-sheet-flow-change'
import { MUSIC_SHEET_FLOW_NODES, type SheetNoteFlowNode } from './music-sheet-flow-nodes'
import { MusicSheetNotePreview } from './music-sheet-note-preview'

type ReactFlowProps = Required<ComponentProps<typeof ReactFlow>>

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
  return (
    <ReactFlowProvider>
      <MusicSheetFlow />
    </ReactFlowProvider>
  )
}

const MusicSheetFlow: FC = () => {
  const { notes, isLoaded, dispatch, moveNotePreview, stretchNotePreview, hideNotePreview, createNoteAtPreview } =
    useUnit({
      notes: editorModel.$sheetNotes,
      isLoaded: editorModel.$isLoaded,
      dispatch: editorModel.actionDispatched,
      moveNotePreview: editorModel.notePreviewMoved,
      stretchNotePreview: editorModel.notePreviewStretched,
      hideNotePreview: editorModel.notePreviewHidden,
      createNoteAtPreview: editorModel.noteRequestedAtPreview,
    })

  const isHoveringNode = useRef(false)
  const isHoveringFlow = useRef(false)
  const flowNodeCache = useRef(new WeakMap<SheetNote, SheetNoteFlowNode>())

  const flowNodes = useMemo(
    () => mapWithWeakMemo(notes.values(), flowNodeCache.current, sheetNoteToFlow).toArray(),
    [notes],
  )

  const onNodesChange = useCallback<ReactFlowProps['onNodesChange']>(
    changes => {
      if (!isHoveringFlow.current) return
      changes
        .map(change =>
          musicSheetNodeChangeToAction({ dimensions: DIMENSIONS, timeStep: SynthTime.eighth.toNotes(), change }),
        )
        .filter(action => action !== null)
        .forEach(dispatch)
    },
    [dispatch],
  )

  const { screenToFlowPosition } = useReactFlow()

  const onMouseMove = useCallback<ReactFlowProps['onPaneMouseMove']>(
    event => {
      if (isHoveringNode.current) return
      const { x, y } = screenToFlowPosition({ x: event.clientX, y: event.clientY })

      const time = DIMENSIONS.note.time(x)
      const pitch = DIMENSIONS.note.pitch(y)

      if (event.buttons === 0) {
        moveNotePreview({ pitch, time })
      } else {
        stretchNotePreview({ until: time })
      }
    },
    [screenToFlowPosition, moveNotePreview, stretchNotePreview],
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

  const id = useId() // NOTE: needed for this ReactFlow to be unique

  if (!isLoaded) {
    return <Loader centered />
  }

  return (
    <ReactFlow
      id={id}
      nodeTypes={MUSIC_SHEET_FLOW_NODES}
      nodes={flowNodes}
      minZoom={1}
      maxZoom={1}
      panOnScroll
      panOnDrag={false}
      height={DIMENSIONS.sheet.height}
      panOnScrollMode={PanOnScrollMode.Free}
      translateExtent={FLOW_EXTENTS}
      proOptions={FLOW_PRO_OPTIONS}
      onNodesDelete={stopHoveringNode}
      onNodesChange={onNodesChange}
      onMouseEnter={startHoveringFlow}
      onMouseLeave={stopHoveringFlow}
      onMouseMove={onMouseMove}
      onSelectionStart={hideNotePreview}
      onNodeMouseMove={startHoveringNode}
      onNodeMouseLeave={stopHoveringNode}
      onPaneClick={createNoteAtPreview}
    >
      <MusicSheetBackground dimensions={DIMENSIONS} />
      <MusicSheetNotePreview dimensions={DIMENSIONS} />
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
