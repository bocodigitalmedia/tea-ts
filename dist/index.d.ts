import { Stream } from 'xstream';
export declare type Update<Msg, State> = (msg: Msg) => (state: State) => State;
export declare type View<Msg, State, VNode> = (dispatch: Dispatch<Msg>) => (state: State) => VNode;
export declare type Dispatch<Msg> = (msg: Msg) => void;
export declare type Init<Msg, State> = (dispatch: Dispatch<Msg>) => State;
export declare type Service<Msg> = (dispatch: Dispatch<Msg>) => (msg: Msg) => void;
export declare type Render<VNode> = (target: HTMLElement) => (vnode: VNode) => void;
export declare type Mounted<Msg, State, VNode> = {
    message$: Stream<Msg>;
    state$: Stream<State>;
    vnode$: Stream<VNode>;
};
export declare type App<Msg, State, VNode> = {
    init: Init<Msg, State>;
    service: Service<Msg>;
    update: Update<Msg, State>;
    view: View<Msg, State, VNode>;
};
export declare type MountParams<Msg, State, VNode> = {
    app: App<Msg, State, VNode>;
    target: HTMLElement;
    render: Render<VNode>;
};
export declare const mount: <Msg, State, VNode>(app: App<Msg, State, VNode>, target: HTMLElement, render: Render<VNode>) => Mounted<Msg, State, VNode>;
