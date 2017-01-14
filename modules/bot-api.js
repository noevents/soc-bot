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
		_context.config.botConfig.token,
		_context.config.botConfig.params
	]);
}

socBot.prototype.on = function (type, callback) {
	socBot.super_.prototype.on.call(this, type, function (message) {
		//logging
		callback(message);
	});
};