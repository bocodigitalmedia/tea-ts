"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var fromEvent_1 = require("xstream/extra/fromEvent");
var noop = function () { };
exports.mount = function (app, target, render) {
    var emitter = new events_1.EventEmitter();
    var dispatch = function (msg) { return emitter.emit('message', msg); };
    var message$ = fromEvent_1.default(emitter, 'message');
    var state$ = message$.fold(function (state, msg) { return app.update(msg)(state); }, app.init(dispatch));
    var vnode$ = state$.map(app.view(dispatch));
    message$.subscribe({
        next: app.service(dispatch),
        error: noop,
        complete: noop
    });
    vnode$.subscribe({
        next: render(target),
        error: noop,
        complete: noop,
    });
    return {
        message$: message$,
        state$: state$,
        vnode$: vnode$
    };
};
//# sourceMappingURL=index.js.map