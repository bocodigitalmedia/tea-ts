import { Subscription } from 'most';
import 'setimmediate';
export declare type Dispatch<Msg> = (msg: Msg) => void;
export declare type Update<Msg, State> = (state: State, msg: Msg) => State;
export declare type Service<Msg> = (dispatch: Dispatch<Msg>) => (msg: Msg) => any;
export declare type Init<Msg, State> = (dispatch: Dispatch<Msg>) => State;
export declare type View<Msg, State, VNode> = (dispatch: Dispatch<Msg>) => (state: State) => VNode;
export declare type Render<VNode> = (target: HTMLElement) => (vNode: VNode) => any;
export interface App<Msg, State, VNode> {
    init: Init<Msg, State>;
    update: Update<Msg, State>;
    service: Service<Msg>;
    view: View<Msg, State, VNode>;
}
export interface AppInstance<VNode> {
    target: HTMLElement;
    subscription: Subscription<VNode>;
}
export declare const mount: <Msg, State, VNode>(app: App<Msg, State, VNode>, target: HTMLElement, render: Render<VNode>) => AppInstance<VNode>;
export declare const unmount: <VNode>({subscription}: AppInstance<VNode>) => void;
