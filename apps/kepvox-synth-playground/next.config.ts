import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [['@effector/swc-plugin', {}]],
  },

  webpack: config => {
    config.module.rules.push({
      test: /^.+\.txt$/,
      type: 'asset/source',
    })

    return config
  },
}

export default nextConfig
