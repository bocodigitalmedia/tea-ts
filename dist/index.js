"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var most_1 = require("most");
var create_1 = require("@most/create");
var setimmediate_1 = require("setimmediate");
exports.mount = function (app, target, render) {
    var receive = function (_) { };
    var dispatch = function (msg) { return setimmediate_1.default(receive, [msg]); };
    var observable = create_1.create(function (next) { receive = next; });
    var messageStream = most_1.from(observable);
    var stateStream = most_1.scan(app.update, app.init(dispatch), messageStream);
    var vNodeStream = most_1.map(function (state) { return app.view(dispatch, state); }, stateStream);
    var serviceStream = most_1.map(function (msg) { return app.service(dispatch, msg); }, messageStream);
    var renderStream = most_1.map(function (vNode) { return render(vNode, target); }, vNodeStream);
    return {
        dispatch: dispatch,
        messageStream: messageStream,
        stateStream: stateStream,
        vNodeStream: vNodeStream,
        serviceStream: serviceStream,
        renderStream: renderStream
    };
};
//# sourceMappingURL=index.js.map