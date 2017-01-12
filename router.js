module.exports = {

	handle: function (ctx, message) {
		// if (isAuth())
			var routeName = (message.text == '/start') ? 'start' : (ctx.commands[message.text] == null) ? null : ctx.commands[message.text].command;
			if (routeName != null) {
				try {
					var route = require('./routes/' + routeName + '-route.js');
					route.handle(ctx, message, this.sendBasicMessage);
				} catch (err) {
					console.log(err);
				}
			} else {
				this.sendBasicMessage(ctx, message.from, 'Непонятная команда');
			// }
		}
	},
	handleCallback: function(ctx, message) {
		try {
			var route = require('./routes/thread-route.js');
			route.handleCallback(ctx, message);
		} catch (err) {
			console.log(err)
		}
	},
	// handleFile
	sendBasicMessage: function (ctx, to, response) {
		ctx.bot.sendMessage(to, response, {parse_mode: 'HTML', reply_markup: getReplyMarkups(ctx, to.id)});
	}
};

function isAdmin(ctx, userId) {
    return ctx.config.admin === userId;
}

function getReplyMarkups(ctx, userId) {
	var replyMarkupArray = {keyboard: [[]], resize_keyboard: true};
	var i = 0, j = 0, columnCount = 2;
	for (var key in ctx.commands) {
		if (!ctx.commands[key].hidden && (isAdmin(ctx, userId) || !ctx.commands[key].admin)) {
			replyMarkupArray.keyboard[i].push(key);
			j = (j < columnCount - 1) ? j + 1 : 0;
			if (j == 0) {
				replyMarkupArray.keyboard.push([]);
				i++;
			}
		}
	}
	return JSON.stringify(replyMarkupArray);
}

//isAdmin