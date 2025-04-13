import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // TODO: might be optional
    swcPlugins: [['@effector/swc-plugin', {}]],
  },

  output: 'standalone',

  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: /^.+\.txt$/,
      type: 'asset/source',
    })

    if (dev) {
      config.plugins.push(new ImportConditionPlugin(['dev']))
    }

    return config
  },
}

class ImportConditionPlugin {
  readonly #conditions: string[]

  constructor(conditions: string[]) {
    this.#conditions = conditions
  }

  apply(compiler: any) {
    compiler.hooks.afterEnvironment.tap(ImportConditionPlugin.name, () => {
      compiler.options.resolve.conditionNames = [...compiler.options.resolve.conditionNames, ...this.#conditions]
    })
  }
}

export default nextConfig
