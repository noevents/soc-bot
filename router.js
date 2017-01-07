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
	// handleCallback
	// handleFile
	sendBasicMessage: function (ctx, to, response) {
		ctx.bot.sendMessage(to, response/*, {parse_mode: 'HTML', reply_markup: getReplyMarkups(ctx, to.id)}*/);
	}
};

//getReplyMarkups
//isAuth
//isAdmin