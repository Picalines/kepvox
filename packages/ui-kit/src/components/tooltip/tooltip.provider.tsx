import { Provider as RadixTooltipProvider } from '@radix-ui/react-tooltip'
import type { FC, ReactNode } from 'react'

export type ProviderProps = {
  children: ReactNode
  delayDuration?: number
}

export const Provider: FC<ProviderProps> = props => <RadixTooltipProvider {...props} />

Provider.displayName = 'Tooltip.Provider'
