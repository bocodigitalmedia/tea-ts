import { EventEmitter } from 'events'
import { Stream } from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'

const noop = () => {}

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
  { message$: Stream< Msg >,
    state$: Stream< State >,
    vnode$: Stream< VNode >
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


  const emitter: EventEmitter = new EventEmitter()

  const dispatch: Dispatch<Msg> = (msg: Msg) => emitter.emit('message', msg)

  const message$: Stream<Msg> = fromEvent(emitter, 'message')

  const state$: Stream<State> =
    message$.fold(
      (state: State, msg: Msg) => app.update(msg)(state),
      app.init(dispatch)
    )

  const vnode$: Stream<VNode> =
    state$.map(app.view(dispatch))

  message$.subscribe({
    next: app.service(dispatch),
    error: noop,
    complete: noop
  })

  vnode$.subscribe({
    next: render(target),
    error: noop,
    complete: noop,
  })

  return {
    message$,
    state$,
    vnode$
  }
}
