import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { readonly } from 'patronum'
import type { CodeEditorStore } from './code-editor'
import { EXAMPLES, type ExampleName } from './examples'

type Params = {
  codeEditor: CodeEditorStore
}

export const createExampleLoader = createFactory((params: Params) => {
  const { codeEditor } = params

  const $examplesDialogShown = createStore(false)

  const userToggledExamplesDialog = createEvent<boolean>()
  const userSelectedAnExample = createEvent<ExampleName>()

  sample({
    clock: userToggledExamplesDialog,
    target: $examplesDialogShown,
  })

  sample({
    clock: userSelectedAnExample,
    filter: $examplesDialogShown,
    target: codeEditor.userChangedCode,
    fn: example => EXAMPLES[example],
  })

  sample({
    clock: codeEditor.userChangedCode,
    target: $examplesDialogShown,
    fn: () => false,
  })

  return {
    $examplesDialogShown: readonly($examplesDialogShown),
    userSelectedAnExample,
    userToggledExamplesDialog,
  }
})
