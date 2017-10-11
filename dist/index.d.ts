import { Stream } from 'most';
export declare type Dispatch<Msg> = (msg: Msg) => void;
export declare type Update<Msg, State> = (state: State, msg: Msg) => State;
export declare type Service<Msg, Result> = (dispatch: Dispatch<Msg>, msg: Msg) => Result;
export declare type Init<Msg, State> = (dispatch: Dispatch<Msg>) => State;
export declare type View<Msg, State, VNode> = (dispatch: Dispatch<Msg>, state: State) => VNode;
export declare type Render<VNode, Result> = (vNode: VNode, target: HTMLElement) => Result;
export interface App<Msg, State, ServiceResult, VNode> {
    init: Init<Msg, State>;
    update: Update<Msg, State>;
    service: Service<Msg, ServiceResult>;
    view: View<Msg, State, VNode>;
}
export interface AppInstance<Msg, State, ServiceResult, VNode, RenderResult> {
    dispatch: Dispatch<Msg>;
    messageStream: Stream<Msg>;
    stateStream: Stream<State>;
    serviceStream: Stream<ServiceResult>;
    vNodeStream: Stream<VNode>;
    renderStream: Stream<RenderResult>;
}
export declare const mount: <Msg, State, ServiceResult, VNode, RenderResult>(app: App<Msg, State, ServiceResult, VNode>, target: HTMLElement, render: Render<VNode, RenderResult>) => AppInstance<Msg, State, ServiceResult, VNode, RenderResult>;
