import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [['@effector/swc-plugin', {}]],
  },

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
  readonly #conditionNames: string[]

  constructor(conditionNames: string[]) {
    this.#conditionNames = conditionNames
  }

  apply(compiler: any) {
    compiler.hooks.afterEnvironment.tap(ImportConditionPlugin.name, () => {
      compiler.options.resolve.conditionNames = [...compiler.options.resolve.conditionNames, ...this.#conditionNames]
    })
  }
}

export default nextConfig
