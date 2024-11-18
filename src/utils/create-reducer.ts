// eslint-disable-next-line
type ActionPayload<P = any> = {
  type: string
  payload: P
}
// eslint-disable-next-line
type Action<A> = (type: A, payload?: any) => ActionPayload
// eslint-disable-next-line
type Reducer<S> = (state: S, payload: any) => S

export const createReducer = <S, A extends string>(
  // eslint-disable-next-line
  reducers: Record<A, (state: S, payload: any) => S>
): [Reducer<S>, Action<A>] => {
  const action: Action<A> = (type, payload) => ({
    type,
    payload
  })
  return [(state: S, action: ActionPayload) => reducers[action.type as A](state, action.payload), action]
}
