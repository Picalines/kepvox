import { Emitter } from '.'

describe('listenMixin', () => {
  it('hides the emit method for users', () => {
    class Class extends Emitter.listenMixin()(Object) {}

    const obj = new Class()

    expectTypeOf(obj.emit).toBeAny()
  })

  it('keeps the constructor parameters', () => {
    class Class extends Emitter.listenMixin()(Object) {
      constructor(_1: number, _2: string) {
        super()
      }
    }

    expectTypeOf(Class).constructorParameters.toEqualTypeOf<[number, string]>()
  })

  it('keeps the base constructor parameters', () => {
    class Base {
      // biome-ignore lint/complexity/noUselessConstructor: testing only the TS
      constructor(_1: number, _2: string) {}
    }

    class Class extends Emitter.listenMixin()(Base) {}

    expectTypeOf(Class).constructorParameters.toEqualTypeOf<[number, string]>()
  })

  it('keeps the derived method', () => {
    class Base {
      derived() {}
    }

    class Class extends Emitter.listenMixin()(Base) {}

    const obj = new Class()

    expectTypeOf(obj.derived).toBeFunction()
  })
})
