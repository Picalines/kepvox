export class ScClient {
  private constructor()

  static connect(config: { port: number; timeout?: number }): Promise<ScClient | null>

  quit(): void
}
