import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [['@effector/swc-plugin', {}]],
  },
}

export default nextConfig
