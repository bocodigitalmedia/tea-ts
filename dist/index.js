import { EventEmitter } from 'events';
import { fromEvent } from 'most';
import 'setimmediate';
export const mount = (app, target, render) => {
    const emitter = new EventEmitter();
    const dispatch = msg => { emitter.emit('msg', msg); };
    const dispatchNextTick = msg => { setImmediate(dispatch, msg); };
    const subscription = fromEvent('msg', emitter)
        .tap(app.service(dispatch))
        .scan(app.update, app.init(dispatchNextTick))
        .map(app.view(dispatch))
        .subscribe({
        next: render(target),
        error: (err) => console.error(err),
        complete: () => console.warn("complete")
    });
    return { target, subscription };
};
export const unmount = ({ subscription }) => {
    subscription.unsubscribe();
};
//# sourceMappingURL=index.js.map