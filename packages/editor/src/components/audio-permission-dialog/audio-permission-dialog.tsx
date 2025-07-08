import { Dialog } from '@repo/ui-kit/components/dialog'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

export const AudioPermissionDialog: FC = () => {
  const { hasAudioPermission, confirmAudio } = useUnit({
    hasAudioPermission: editorModel.$hasAudioPermission,
    confirmAudio: editorModel.userGrantedAudioPermission,
  })

  return (
    <Dialog.Root open={!hasAudioPermission}>
      <Dialog.Title>Audio permission</Dialog.Title>
      <Dialog.Description>Attention needed</Dialog.Description>
      <Dialog.Content>
        Your browser has not allowed audio playback. For the editor to work correctly, please allow audio
      </Dialog.Content>
      <Dialog.Action onClick={confirmAudio}>Allow audio</Dialog.Action>
    </Dialog.Root>
  )
}
