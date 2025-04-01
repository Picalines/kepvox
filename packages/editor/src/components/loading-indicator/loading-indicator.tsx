import { cn } from '@repo/ui-kit/classnames'
import { Loader } from '@repo/ui-kit/components/loader'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

export const LoadingIndicator: FC = () => {
  const { isLoaded, haveChanged, serializedProject, gateState } = useUnit({
    isLoaded: editorModel.$isLoaded,
    haveChanged: editorModel.$haveChanged,
    serializedProject: editorModel.$serializedProject,
    gateState: editorModel.Gate.state,
  })

  const loading = gateState.externalLoading || !isLoaded || (haveChanged && !serializedProject)

  return (
    <div
      aria-hidden
      className={cn(
        'zoom-in zoom-out pointer-events-none absolute bottom-10 left-10 z-10 h-7 w-7 rounded-full bg-background shadow-lg transition-opacity',
        loading ? 'animate-in opacity-100' : 'animate-out opacity-0',
      )}
    >
      <Loader centered />
    </div>
  )
}
