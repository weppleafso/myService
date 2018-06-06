var util = require('../../../../util/util');
var dispatch = require('../../../../util/dispatch');

//错误码
const MSG_MISS_PARAM = 'MSG_MISS_PARAM';
const SERVICE_ERROR = 'SERVICE_ERROR';
module.export = function (app) {
    return new Handler(app);
}
var Handler = function (app) {
    this.app = app;
};
var handler = Handler.prototype;
handler.queryEntry = function (msg, session, next) {
    var uid = msg.uid;
    if (!uid) {
        return next(null, { code: util.error(MSG_MISS_PARAM) });
    }
    let connectors = app.getServersByType('connector');
    if (!connectors || connectors.length == 0) {
        return next(null, { code: SERVICE_ERROR });
    }
    let connector = dispatch.dispatch(uid, connectors);
    return next(null, { code: 0, host: connector.clientHost, port: connector.clientPort });
}