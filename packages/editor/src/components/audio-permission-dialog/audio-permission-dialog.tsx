import { Button } from '@repo/ui-kit/components/button'
import { Dialog } from '@repo/ui-kit/components/dialog'
import { Text } from '@repo/ui-kit/components/text'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

export const AudioPermissionDialog: FC = () => {
  const { hasAudioPermission, onConfirmAudio } = useUnit({
    hasAudioPermission: editorModel.$hasAudioPermission,
    onConfirmAudio: editorModel.userGrantedAudioPermission,
  })

  return (
    <Dialog.Root open={!hasAudioPermission}>
      <Dialog.Title>Audio permission</Dialog.Title>
      <Dialog.Description>Attention needed</Dialog.Description>
      <Dialog.Content closable={false} className="space-y-4">
        <Text className="block">
          Your browser has not allowed audio playback. For the editor to work correctly, please allow audio
        </Text>
        <Button.Root onClick={onConfirmAudio}>
          <Button.Text>Allow audio</Button.Text>
        </Button.Root>
      </Dialog.Content>
    </Dialog.Root>
  )
}
