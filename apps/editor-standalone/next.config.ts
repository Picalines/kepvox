import baseConfig from '@repo/next-config'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  ...baseConfig,

  output: 'export',
  basePath: '/kepvox/editor',

  images: {
    unoptimized: true,
  },
}

export default nextConfig
