import { createFactory, invoke } from '@withease/factories'
import { type FC, createContext, useContext } from 'react'

export const createModelApi = <TModel, TConfig = {}>(creator: (config: TConfig) => TModel) => {
  const factory = createFactory(creator)

  const createModel = (...config: {} extends TConfig ? [] : [TConfig]) => {
    return invoke(factory, ...(config as [TConfig]))
  }

  const ModelContext = createContext<TModel | null>(null)

  const Provider = ModelContext.Provider

  type PropsWithModel<Props> = Props & { model: TModel }

  const withModel = <Props,>(Component: FC<Omit<Props, 'model'>>) => {
    return ({ model, ...props }: PropsWithModel<Props>) => (
      <Provider value={model}>
        <Component {...props} />
      </Provider>
    )
  }

  const useModel = () => {
    const model = useContext(ModelContext)

    if (!model) {
      throw new Error('useModel called outside the model context')
    }

    return model
  }

  return {
    createModel,
    Provider,
    withModel,
    useModel,
  }
}
