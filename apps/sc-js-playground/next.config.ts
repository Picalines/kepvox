import CopyPlugin from 'copy-webpack-plugin'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
      new CopyPlugin({
        patterns: [
          {
            from: '../../packages/scsynth-wasm/dist',
            to: '../public/scsynth',
          },
        ],
      }),
    )

    return config
  },
}

export default nextConfig
