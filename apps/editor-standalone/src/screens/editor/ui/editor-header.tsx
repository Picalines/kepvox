import { Heading } from '@repo/ui-kit/components/heading'
import { ThemeSwitcher } from '@repo/ui-kit/components/theme'
import type { FC } from 'react'

export const EditorHeader: FC = () => {
  return (
    <div className="flex items-center gap-2 border-b-2 p-2">
      <div className="grow" />
      <Heading.Root align="end">
        <Heading.SuperTitle>kepvox</Heading.SuperTitle>
        <Heading.Title>editor</Heading.Title>
      </Heading.Root>
      <ThemeSwitcher variant="outline" size="lg" />
    </div>
  )
}
