export class ScClient {
  private constructor()

  static connect(config: { port: number; timeout?: number; serverName?: string }): Promise<ScClient | null>

  quit(): void
}
