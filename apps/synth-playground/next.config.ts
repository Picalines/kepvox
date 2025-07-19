import baseConfig from '@repo/next-config'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  ...baseConfig,

  output: 'export',
  basePath: '/kepvox/synth-playground',

  images: {
    unoptimized: true,
  },
}

export default nextConfig
