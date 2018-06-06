var util = require('../../../../util/util');
//错误码
const MSG_MISS_PARAM = 'MSG_MISS_PARAM';
const SERVICE_ERROR = 'SERVICE_ERROR';
const NOCHATCHANNEL = 'NOCHATCHANNEL';
module.exports = function (app) {
    return new ChatRemote(app);
}
var ChatRemote = function (app) {
    this.app = app;
    this.channelService = app.get("channelService");
}
var prototype = ChatRemote.prototype;
prototype.add = function (uid, nickName, rid, sid, cb) {
    let channel = this.channelService.getChannel(rid,true);
    if (!channel) {
        return cb({ code: util.getError(NOCHATCHANNEL) });
    }
    let route = "onAdd";
    let msg = {
        nickName: nickName
    }
    channel.pushMessage(route, msg);
    var users = [];
    let members = channel.getMembers();
    for(let i = 0,len = members.length;i<len;i++){
        users.push(members[i].split("*")[0]);
    }
    channel.add(uid, sid);
    return cb({ code: 0, member: users });
}
prototype.kill = function (uid, nickName, rid, sid, cb) {
    let channel = this.channelService.getChannel(rid,true);
    if (!channel) {
        return cb({ code: util.getError(NOCHATCHANNEL) });
    }
    channel.leave(uid, sid);
    let route = "onLevel";
    let msg = {
        nickName
    }
    channel.pushMessage(route, msg);
    cb && cb({ code: 0 });
}