var util = require('../../../../util/util');

const NOCHATCHANNEL = 'NOCHATCHANNEL';
module.exports = function (app) {
    return new Handler(app);
}
var Handler = function (app) {
    this.app = app;
}
var handler = Handler.prototype;
handler.send = function (args, session, next) {
    var rid = session.get('rid');
    var username = session.uid.split('*')[0];
    var channelService = this.app.get('channelService');
    let channel = channelService.getChannel(rid, false);
    if (!channel) {
        return next(null, { code: util.getError(NOCHATCHANNEL) });
    }
    let { to, msg } = args;
    if (to) {
        var tuid = to + '*' + rid;
        var tsid = channel.getMember(tuid)['sid'];
        let route = "onChat";
        let msg = {
            msg,
            from: nickName,
            to: to,
        }
        channelService.pushMessageByUids(route, msg, [{ uid: tuid, sid: tsid }]);
    }
    else {
        let route = "onChat";
        let msg = {
            msg,
            from: nickName,
        }
        channel.pushMessage(route, msg);
    }
    return next(null, { code: 0 });
}