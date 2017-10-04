"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var create_1 = require("@most/create");
exports.mount = function (app, target, render) {
    var receiveMsg = function (_) { };
    var message$ = create_1.create(function (next) {
        receiveMsg = next;
    });
    var dispatch = function (msg) {
        process.nextTick(function () {
            receiveMsg(msg);
        });
    };
    var state$ = message$
        .scan(function (state, msg) { return app.update(msg)(state); }, app.init(dispatch));
    var vnode$ = state$
        .map(function (state) { return app.view(dispatch)(state); });
    message$.observe(app.service(dispatch));
    vnode$.observe(render(target));
    return {
        message$: message$,
        state$: state$,
        vnode$: vnode$
    };
};
//# sourceMappingURL=index.js.map