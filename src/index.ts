import { Observable } from 'most'
import { create as createObservable } from '@most/create'

export type Update< Msg, State > =
  (msg: Msg) => (state: State) => State

export type View< Msg, State, VNode > =
  (dispatch: Dispatch< Msg >) => (state: State) => VNode

export type Dispatch< Msg > =
  (msg: Msg) => void

export type Init< Msg, State > =
  (dispatch: Dispatch< Msg >) => State

export type Service< Msg > =
  (dispatch: Dispatch< Msg >) => (msg: Msg) => void

export type Render< VNode > =
  (target: HTMLElement) => (vnode: VNode) => void

export type Mounted< Msg, State, VNode > =
  { message$: Observable< Msg >,
    state$: Observable< State >,
    vnode$: Observable< VNode >
  }

export type App<Msg, State, VNode> = {
  init: Init<Msg, State>,
  service: Service<Msg>,
  update: Update<Msg, State>,
  view: View<Msg, State, VNode>
}

export type MountParams<Msg, State, VNode> = {
  app: App<Msg, State, VNode>,
  target: HTMLElement,
  render: Render<VNode>
}

export const mount = <Msg, State, VNode>
  ( app: App<Msg, State, VNode>,
    target: HTMLElement,
    render: Render<VNode>
  ): Mounted<Msg, State, VNode> => {

  let receiveMsg = (_: Msg): void => {}

  const message$ = createObservable(next => {
    receiveMsg = next
  })

  const dispatch: Dispatch<Msg> = msg => {
    process.nextTick(() => {
      receiveMsg(msg)
    })
  }

  const state$ = message$
    .scan(
      (state: State, msg: Msg) => app.update(msg)(state),
      app.init(dispatch)
    )

  const vnode$ = state$
    .map((state: State) => app.view(dispatch)(state))

  message$.observe(app.service(dispatch))

  vnode$.observe(render(target))

  return {
    message$,
    state$,
    vnode$
  }
}
