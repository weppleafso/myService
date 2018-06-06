var dispatch = require('./dispatch');
module.exports.chat = function(session, msg, app, cb){
    console.log("chat xxxxx");
    console.log(session);
    let chatServers = app.getServersByType('chat');
    if(!chatServers || chatServers.length == 0){
        cb(new Error('can not find chat servers.'));
		return;
    }
    let rid = session.get('rid');
    var res = dispatch.dispatch(rid, chatServers);
    cb(null,res.id);
}