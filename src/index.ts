import { EventEmitter } from 'events'
import { Subscription, fromEvent } from 'most'
import 'setimmediate'

export type Dispatch<Msg> =
  (msg: Msg) => void

export type Update<Msg, State> =
  (state: State, msg: Msg) => State

export type Service<Msg> =
  (dispatch: Dispatch<Msg>) => (msg: Msg) => any

export type Init<Msg, State> =
  (dispatch: Dispatch<Msg>) => State

export type View<Msg, State, VNode> =
  (dispatch: Dispatch<Msg>) => (state: State) => VNode

export type Render<VNode> =
  (target: HTMLElement) => (vNode: VNode) => any

export interface App<Msg, State, VNode> {
  init:    Init<Msg, State>
  update:  Update<Msg, State>
  service: Service<Msg>
  view:    View<Msg, State, VNode>
}

export interface AppInstance<VNode> {
  target: HTMLElement
  subscription: Subscription<VNode>
}

export const mount = <Msg, State, VNode>
  ( app: App <Msg, State, VNode>,
    target: HTMLElement,
    render: Render<VNode>,
  ) : AppInstance<VNode> => {

    const emitter = new EventEmitter()

    const dispatch: Dispatch<Msg> =
      msg => { emitter.emit('msg', msg) }

    const dispatchNextTick: Dispatch<Msg> =
      msg => { setImmediate(dispatch, msg) }

    const subscription =
      fromEvent <Msg> ('msg', emitter)
      .tap(app.service(dispatch))
      .scan(app.update, app.init(dispatchNextTick))
      .map(app.view(dispatch))
      .subscribe({
        next: render(target),
        error: (err) => console.error(err),
        complete: () => console.warn("complete")
      })

    return { target, subscription }
  }

export const unmount = <VNode>
  ( { subscription }: AppInstance<VNode> ) => {
    subscription.unsubscribe()
  }
