import { invoke } from '@withease/factories'
import { createGate } from 'effector-react'
import { createCodeEditor } from './code-editor'
import { createExampleLoader } from './example-loader'
import { createJsRunner } from './js-runner'
import { createPlayback } from './playback'
import { createSynth } from './synth'

const Gate = createGate<{}>()

const codeEditor = invoke(createCodeEditor, { gate: Gate })
const jsRunner = invoke(createJsRunner, { gate: Gate })
const synth = invoke(createSynth, { gate: Gate })
const playback = invoke(createPlayback, { codeEditor, synth, jsRunner })
const exampleLoader = invoke(createExampleLoader, { codeEditor })

const { $code, $isReadonly, userChangedCode } = codeEditor
const { $elapsedSeconds, $elapsedNotes } = synth
const { $error: $jsError } = jsRunner
const { $status, userToggledPlayback } = playback
const { $examplesDialogShown, userSelectedAnExample, userToggledExamplesDialog } = exampleLoader

export {
  $code,
  $elapsedNotes,
  $elapsedSeconds,
  $examplesDialogShown,
  $isReadonly,
  $jsError,
  $status,
  Gate,
  userChangedCode,
  userSelectedAnExample,
  userToggledExamplesDialog,
  userToggledPlayback,
}
