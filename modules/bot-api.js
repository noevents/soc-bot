module.exports = socBot;

var TelegramBot = require('node-telegram-bot-api');
var _context = null;

socBot.super_ = TelegramBot;

socBot.prototype = Object.create(TelegramBot.prototype, {
	constructor: {
		value: socBot,
		enumerable: false
	}
});

function socBot(context) {
	_context = context;
	socBot.super_.apply(this, [
		_context.config.botInfo.token,
		_context.config.botInfo.params
	]);
}

socBot.prototype.sendMessage = function (to, messageText, params) {
	//logging
	//saving to db
	socBot.super_.prototype.sendMessage.call(this, to.id, messageText, params);
};