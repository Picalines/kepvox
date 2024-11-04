import type { Config } from 'tailwindcss'

import sharedConfig from '@repo/tailwind-config'
import uiKitConfig from '@repo/ui-kit/tailwind-config'

const config: Config = {
  presets: [sharedConfig, uiKitConfig],

  content: ['./src/**/*.tsx', '../../packages/ui-kit/src/**/*.tsx'],
}

export default config
