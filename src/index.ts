import { Observable, Stream, map, scan, from as streamFrom } from 'most'
import { create as createObservable } from '@most/create'
import setImmediate from 'setimmediate'

export type Dispatch <Msg> =
  (msg: Msg) => void

export type Update <Msg, State> =
  (state: State, msg: Msg) => State

export type Service <Msg, Result> =
  (dispatch: Dispatch <Msg>, msg: Msg) => Result

export type Init <Msg, State> =
  (dispatch: Dispatch <Msg>) => State

export type View <Msg, State, VNode> =
  (dispatch: Dispatch <Msg>, state: State) => VNode

export type Render <VNode, Result> =
  (vNode: VNode, target: HTMLElement) => Result

export interface App <Msg, State, ServiceResult, VNode> {
  init: Init <Msg, State>,
  update: Update <Msg, State>,
  service: Service <Msg, ServiceResult>,
  view: View <Msg, State, VNode>
}

export interface AppInstance <Msg, State, ServiceResult, VNode, RenderResult> {
  dispatch: Dispatch <Msg>,
  messageStream: Stream <Msg>,
  stateStream: Stream <State>,
  serviceStream: Stream <ServiceResult>,
  vNodeStream: Stream <VNode>,
  renderStream: Stream <RenderResult>
}

export const mount =
  <Msg, State, ServiceResult, VNode, RenderResult>
  ( app: App <Msg, State, ServiceResult, VNode>,
    target: HTMLElement,
    render: Render <VNode, RenderResult>,
  ): AppInstance <Msg, State, ServiceResult, VNode, RenderResult> => {

    let receive: (msg: Msg) => void =
      _ => {}

    const dispatch: (msg: Msg) => void =
      msg => setImmediate(receive, [msg])

    const observable: Observable <Msg> =
      createObservable(next => { receive = next })

    const messageStream: Stream <Msg> =
      streamFrom(observable)

    const stateStream: Stream <State> =
      scan(app.update, app.init(dispatch), messageStream)

    const vNodeStream: Stream <VNode> =
      map(state => app.view(dispatch, state), stateStream)

    const serviceStream: Stream <ServiceResult> =
      map(msg => app.service(dispatch, msg), messageStream)

    const renderStream: Stream <RenderResult> =
      map(vNode => render(vNode, target), vNodeStream)

    return {
      dispatch,
      messageStream,
      stateStream,
      vNodeStream,
      serviceStream,
      renderStream
    }
  }
