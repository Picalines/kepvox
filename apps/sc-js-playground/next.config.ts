import FileManagerPlugin from 'filemanager-webpack-plugin'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [['@effector/swc-plugin', {}]],
  },

  // NOTE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
      ],
    },
  ],

  webpack: config => {
    config.plugins.push(
      new FileManagerPlugin({
        events: {
          onStart: [{ delete: ['./public/sc-synth'] }],
          onEnd: [{ copy: [{ source: '../../packages/sc-synth/dist', destination: './public/sc-synth' }] }],
        },
      }),
    )

    return config
  },
}

export default nextConfig
