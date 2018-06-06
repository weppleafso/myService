var util = require('../../../../util/util');
//错误码
const MSG_MISS_PARAM = 'MSG_MISS_PARAM';
const SERVICE_ERROR = 'SERVICE_ERROR';
const SAME_NICKNAME = 'SAME_NICKNAME';


module.exports = function (app) {
	return new Handler(app);
};

var Handler = function (app) {
	this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function (msg, session, next) {
	let rid = msg.rid;
	let nickName = msg.nickName;

	if (!rid || !nickName) {
		return next(null, { code: util.getError(MSG_MISS_PARAM) });
	}
	let uid = nickName + "*" + rid;
	let sessionService = this.app.get("sessionService");
	if (!!sessionService.getByUid(uid)) {
		return next(null, { code: util.getError(MSG_MISS_PARAM) });
	}
	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function (err) {
		if (err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	})
	let self = this;
	session.on('closed', onUserLeave.bind(null, self.app, nickName));
	let sid = this.app.getServerId();
	this.app.rpc.chat.chatRemote.add(session, uid, nickName, rid, sid, function (ret) {
		next(null, ret);
	})
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function (app, nickName, session) {
	if (!session || !session.uid) {
		return;
	}
	app.rpc.chat.chatRemote.kill(session, session.uid, nickName, session.get('rid'), app.getServerId(), null);
};
