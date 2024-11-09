export type ScClientConfig = {
  port: number
  timeout?: number
  serverName?: string
}

export class ScClient {
  private constructor()

  static connect(config: ScClientConfig): Promise<ScClient | null>

  freeAll(): void
}
