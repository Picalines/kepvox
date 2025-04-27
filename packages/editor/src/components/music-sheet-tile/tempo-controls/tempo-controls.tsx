import { assertTrue } from '@repo/common/assert'
import { TimeSignature } from '@repo/synth'
import { NumberInput } from '@repo/ui-kit/components/number-input'
import { Select } from '@repo/ui-kit/components/select'
import { useUnit } from 'effector-react'
import { type FC, useCallback } from 'react'
import { editorModel } from '#model'

export const TempoControls: FC = () => {
  const { timeSignature, beatsPerMinute, requestActions } = useUnit({
    timeSignature: editorModel.$timeSignature,
    beatsPerMinute: editorModel.$beatsPerMinute,
    requestActions: editorModel.userRequestedActions,
  })

  const onSignatureChange = useCallback(
    (value: string) => requestActions([{ action: 'time-signature-set', timeSignature: parseTimeSignature(value) }]),
    [requestActions],
  )

  const onBeatsPerMinuteChange = useCallback(
    (value: number) => requestActions([{ action: 'beats-per-minute-set', beatsPerMinute: value }]),
    [requestActions],
  )

  return (
    <>
      <Select.Root value={timeSignature.toString()} onValueChange={onSignatureChange}>
        <Select.Label>Time</Select.Label>
        <Select.Trigger>
          {timeSignature.beatsInBar}/{timeSignature.beatsInNote}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            {SELECT_TIME_SIGNATURES.map(signature => (
              <Select.Item key={signature.toString()} value={signature.toString()}>
                {signature.toString()}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <NumberInput.Root value={beatsPerMinute} onValueChange={onBeatsPerMinuteChange} className="w-30">
        <NumberInput.Label>BPM</NumberInput.Label>
      </NumberInput.Root>
    </>
  )
}

const SELECT_TIME_SIGNATURES = [
  new TimeSignature(4, 4),
  new TimeSignature(2, 2),
  new TimeSignature(2, 4),
  new TimeSignature(3, 4),
  new TimeSignature(3, 8),
  new TimeSignature(6, 8),
  new TimeSignature(9, 8),
  new TimeSignature(12, 8),
]

const parseTimeSignature = (value: string) => {
  const [beatsInBarStr, beatsInNoteStr] = value.split('/', 2)
  const beatsInBar = Number.parseInt(beatsInBarStr ?? '1')
  const beatsInNote = Number.parseInt(beatsInNoteStr ?? '1')

  assertTrue(Number.isFinite(beatsInBar))
  assertTrue(Number.isFinite(beatsInNote))

  return new TimeSignature(beatsInBar, beatsInNote)
}
